require('dotenv').config();

const email = process.env.EMAIL;
const fetch = require('node-fetch');
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

export class PubChemService {
  getCIDs(CAS) {
    const uri = `http://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${CAS}/cids/json?email=${email}`;
    return Observable.fromPromise(fetch(uri))
      .switchMap(res => res.json())
      .map(json => json.IdentifierList.CID)
      .catch(() => Observable.of([])); // Assume there is no results if error
  }

  getCount(collection) {
    return (CIDs) =>
      Observable.from(CIDs)
        .mergeMap(CID =>
          Observable.fromPromise(fetch(`https://pubchem.ncbi.nlm.nih.gov/sdq/sdqagent.cgi?infmt=json&outfmt=json&query={"select":["*"],"collection":"${collection}","where":{"ors":{"cid":"${CID}"}},"start":1,"limit":1}`))
        )
        .mergeMap(res => res.json())
        .map(json => json.SDQOutputSet[0].totalCount)
        .reduce((acc, cur) => acc + cur, 0);
  }

  getPathwayCount = this.getCount('biosystem');

  getAssayCount = this.getCount('bioactivity');
}
