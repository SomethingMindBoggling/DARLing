require('dotenv').config();

import { CompoundSet } from '../models/compound-set';
import { Database, ObjectId } from 'mongorito';

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/catch';

const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

export class CompoundsService {
  constructor(pubChemService, metaCycService, wikipathwaysService, queueService) {
    this.pubChemService = pubChemService;
    this.queueService = queueService;
    this.metaCycService = metaCycService;
    this.wikipathwaysService = wikipathwaysService;
    const db = new Database(`mongodb://${dbUser}:${dbPass}@ds151651.mlab.com:51651/dar-tool`);
    db.register(CompoundSet);
    db.connect();
  }

  buildCompounds(dataset) {
    return Observable.from(dataset)
      // PubChem
      .mergeMap(singleDataset => this.pubChemService.getCIDs(singleDataset.CAS),
        (singleDataset, CIDs) => Object.assign({}, singleDataset, { pubChem: { IDs: CIDs } }))
      .mergeMap(data => Observable.zip(
        this.pubChemService.getAssayCount(data.pubChem.IDs),
        this.pubChemService.getPathwayCount(data.pubChem.IDs),
        (assayCount, pathwayCount) => Object.assign({}, data,
          { pubChem: Object.assign({}, data.pubChem, { assayCount, pathwayCount }) })
        )
      )
      // metaCyc
      .mergeMap(data => this.metaCycService.getBioCycIDFromCIDs(data.pubChem.IDs),
        (data, bioCycIDs) => Object.assign(
          {},
          data,
          { metaCyc: { IDs: bioCycIDs } }
        ))
      .mergeMap(data => Observable.zip(
        this.metaCycService.getPathwayCount(data.metaCyc.IDs),
        this.metaCycService.getReactionsCount(data.metaCyc.IDs),
        (pathwayCount, reactionCount) => Object.assign({}, data,
          { metaCyc: Object.assign({}, data.metaCyc, { reactionCount, pathwayCount }) }
        )
      ))
      // WikiPathways
      .mergeMap(data => this.wikipathwaysService.getPathwayCountAndIDs(data.pubChem.IDs),
        (data, WikiPathways) => Object.assign(
          {},
          data,
          {
            wikiPathways: WikiPathways,
          }
        )
      )
      .reduce((acc, cur) => {
        acc.push(cur);
        return acc;
      }, []);
  }

  countAndSave(name, dataset) {
    const compoundSet = new CompoundSet({
      name,
    });
    return this.buildCompounds(dataset)
      .switchMap(compounds => {
        compoundSet.set('compounds', compounds);
        return Observable.fromPromise(compoundSet.save());
      })
      .toPromise();
  }

  create(name, dataset, email) {
    this.queueService.addJob('countCompoundsSet', (job, done) => {
      this.countAndSave(name, dataset).then(() => {
        // Notify creator via email
        nodemailerMailgun.sendMail({
          from: `"DAR Notifier" <notifer@${process.env.MAILGUN_DOMAIN}>`,
          to: email,
          subject: 'Compounds Processed!',
          text: 'Congratulations, your compound list has preen processed and ranked',
        });
        done();
      }).catch(err => done(err));
    });
    return new Promise(resolve =>
      resolve('Your compounds set has been added to the queue and will be processed shortly.'));
  }

  get(id) {
    return CompoundSet.findOne({ _id: new ObjectId(id) });
  }

  getAll(skip = 0, limit = 10) {
    return CompoundSet.limit(limit).skip(skip).find();
  }
}
