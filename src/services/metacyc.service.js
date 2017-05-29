const fetch = require('node-fetch');
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/bindCallback';

const parseString = require('xml2js').parseString;


export class MetaCycService {
  getBioCycIDFromCIDs(CIDs) {
    return Observable.from(CIDs)
      .exhaustMap(CID => fetch(`https://websvc.biocyc.org/META/foreignid?ids=PUBCHEM:${CID}&fmt=json`,
        { headers: { 'Content-Type': 'application/json; charset=UTF-8' }, compress: false }))
      .exhaustMap(res => res.json())
      .map(json => json[0].RESULTS.map(singleResult => singleResult.ID));
  }

  getObjectSet(apiFunction, bioCycIDs) {
    return Observable.from(bioCycIDs)
      .switchMap(bioCycID =>
        Observable.fromPromise(
          fetch(`https://websvc.biocyc.org/apixml?fn=${apiFunction}&id=META:${bioCycID}&detail=low`,
            { headers: { 'Content-Type': 'application/json; charset=UTF-8' }, compress: false })
        )
      )
      .switchMap(res => res.text())
      .switchMap(xml => Observable.bindCallback(parseString)(xml));
  }

  getPathwayCount(bioCycIDs) {
    return this.getObjectSet('pathways-of-compound', bioCycIDs)
      .map(json => json[1]['ptools-xml'].Pathway)
      .map(pathways => pathways.length)
      .reduce((acc, cur) => acc + cur, 0);
  }

  getReactionsCount(bioCycIDs) {
    return this.getObjectSet('reactions-of-compound', bioCycIDs)
      .map(json => json[1]['ptools-xml'].Reaction)
      .map(reactions => reactions.length)
      .reduce((acc, cur) => acc + cur, 0);
  }
}
