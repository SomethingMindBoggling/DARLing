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

export class CompoundsService {
  constructor(pubChemService, metaCycService, queueService) {
    this.pubChemService = pubChemService;
    this.queueService = queueService;
    this.metaCycService = metaCycService;
    const db = new Database(`mongodb://${dbUser}:${dbPass}@ds151651.mlab.com:51651/dar-tool`);
    db.register(CompoundSet);
    db.connect();
  }

  buildCompounds(dataset) {
    const CASs = dataset.map(singleDataPoint => singleDataPoint.CAS);

    return Observable.from(CASs)
      .mergeMap(singleCas => this.pubChemService.getCID(singleCas),
        (singleCas, CIDs) => Object.assign({}, { CAS: singleCas, CIDs }))
      .mergeMap(casAndCid => this.pubChemService.getAssayCount(casAndCid.CIDs),
        (casAndCid, assayCount) => Object.assign({}, casAndCid, { pubchemAssayCount: assayCount })
      )
      .mergeMap(almostFull => this.pubChemService.getPathwayCount(almostFull.CIDs),
        (almostFull, pathwayCount) => Object.assign(
          {},
          almostFull,
          { pubchemPathwayCount: pathwayCount }
        )
      )
      .mergeMap(almostFull => this.metaCycService.getBioCycIDFromCIDs(almostFull.CIDs),
        (almostFull, bioCycIDs) => Object.assign(
          {},
          almostFull,
          { bioCycIDs }
        )
      )
      .mergeMap(almostFull => this.metaCycService.getPathwayCount(almostFull.bioCycIDs),
        (almostFull, pathwayCount) => Object.assign(
          {},
          almostFull,
          { bioCycPathwayCount: pathwayCount }
        )
      )
      .mergeMap(almostFull => this.metaCycService.getReactionsCount(almostFull.bioCycIDs),
        (almostFull, reactionCount) => Object.assign(
          {},
          almostFull,
          { bioCycReactionCount: reactionCount }
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

  create(name, dataset) {
    this.queueService.addJob('countCompoundsSet', (job, done) => {
      this.countAndSave(name, dataset).then(() => done()).catch(err => done(err));
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
