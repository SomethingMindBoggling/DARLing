const fetch = require('node-fetch');
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/observable/of';

const parseString = require('xml2js').parseString;

export class MetaCycService {
  getBioCycIDFromCIDs(CIDs) {
    return Observable.from(CIDs)
      .mergeMap(CID => fetch(`https://websvc.biocyc.org/META/foreignid?ids=PUBCHEM:${CID}&fmt=json`,
        { headers: { 'Content-Type': 'application/json; charset=UTF-8' }, compress: false }))
      .mergeMap(res => res.json())
      .map(json => json[0].RESULTS.map(singleResult => singleResult.ID))
      .catch(() => Observable.from([])) // Assume no results if error
      .reduce((acc, cur) => acc.concat(cur), []);
  }

  getObjectSet(apiFunction, bioCycIDs) {
    return Observable.from(bioCycIDs)
      .mergeMap(bioCycID =>
        Observable.fromPromise(
          fetch(`https://websvc.biocyc.org/apixml?fn=${apiFunction}&id=META:${bioCycID}&detail=low`,
            { headers: { 'Content-Type': 'application/json; charset=UTF-8' }, compress: false })
        )
      )
      .mergeMap(res => res.text())
      .mergeMap(xml => Observable.bindCallback(parseString)(xml))
      .retry(1);
  }

  getPathwayCount(bioCycIDs) {
    return this.getObjectSet('pathways-of-compound', bioCycIDs)
      .map(json => json[1]['ptools-xml'].Pathway)
      .map(pathways => pathways.length)
      .catch(() => Observable.of(0)) // Assume no count
      .reduce((acc, cur) => acc + cur, 0);
  }

  getReactionsCount(bioCycIDs) {
    return this.getObjectSet('reactions-of-compound', bioCycIDs)
      .map(json => json[1]['ptools-xml'].Reaction)
      .map(reactions => reactions.length)
      .catch(() => Observable.of(0)) // Assume no count
      .reduce((acc, cur) => acc + cur, 0);
  }
}
