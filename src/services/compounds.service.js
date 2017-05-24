require('dotenv').config();

import { CompoundSet } from '../models/compound-set';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeAll';

export class CompoundsService {
  constructor(pubChemService) {
    this.pubChemService = pubChemService;
    mongoose.connect(`mongodb://${dbUser}:${dbPass}@ds151651.mlab.com:51651/dar-tool`);
  }

  buildCompounds(dataset) {
    const CASs = dataset.map(singleDataPoint => singleDataPoint.CAS);

    return Observable.from(CASs)
      .switchMap(singleCas => this.pubChemService.getCID(singleCas),
        (singleCas, CIDs) => Object.assign({}, { CAS: singleCas, CIDs }))
      .switchMap(casAndCid => this.pubChemService.getAssayCount(casAndCid.CIDs),
        (casAndCid, assayCount) => Object.assign({}, casAndCid, { pubchemAssayCount: assayCount })
      )
      .switchMap(almostFull => this.pubChemService.getPathwayCount(almostFull.CIDs),
        (almostFull, pathwayCount) => Object.assign(
          {},
          almostFull,
          { pubchemPathwayCount: pathwayCount }
        )
      )
      .reduce((acc, cur) => {
        acc.push(cur);
        return acc;
      }, []);
  }

  create(name, owner, dataset) {
    const compoundSet = new CompoundSet();
    compoundSet.owner = owner;
    compoundSet.name = name;

    return new Promise((resolve, reject) => {
      this.buildCompounds(dataset).subscribe(compounds => {
        compoundSet.compounds = compounds;
        compoundSet.save(err => {
          if (err) {
            reject(err);
            return
          }
          resolve();
        });
      });
    })
  }
}
