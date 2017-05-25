require('dotenv').config();

import { CompoundSet } from '../models/compound-set';
import { Database, ObjectId }  from 'mongorito';

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

export class CompoundsService {
  constructor(pubChemService) {
    this.pubChemService = pubChemService;
    const db = new Database(`mongodb://${dbUser}:${dbPass}@ds151651.mlab.com:51651/dar-tool`);
    db.register(CompoundSet);
    db.connect();
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
    const compoundSet = new CompoundSet({
      owner,
      name,
    });
    return this.buildCompounds(dataset)
      .switchMap(compounds => {
        compoundSet.set('compounds', compounds);
        return Observable.fromPromise(compoundSet.save());
      })
      .toPromise();
  }

  get(id) {
    return CompoundSet.findOne({ _id: new ObjectId(id) });
  }

  getAll(skip = 0, limit = 10) {
    return CompoundSet.limit(limit).skip(skip).find();
  }
}
