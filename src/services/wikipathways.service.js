const fetch = require('node-fetch');
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/reduce';

export class WikiPathwaysService {
  getPathwayCountAndIDs(CIDs) {
    return Observable.from(CIDs)
        .mergeMap(CID =>
          Observable.fromPromise(fetch(`http://webservice.wikipathways.org/findPathwaysByXref?ids=${CID}&codes=Cpc&format=json`))
        )
        .mergeMap(res => res.json())
        .map(json => {
          return {
            pathwayCount: json.result.length,
            IDs: json.result.map(singleResult => singleResult.id),
          };
        })
        .reduce((acc, cur) =>
          Object.assign(
            {},
            acc,
            { pathwayCount: acc.pathwayCount + cur.pathwayCount, IDs: acc.IDs.concat(cur.IDs) }
          ), {
            pathwayCount: 0,
            IDs: [],
          });
  }
}
