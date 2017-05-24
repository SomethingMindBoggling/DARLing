const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

import { CompoundsService } from '../../src/services/compounds.service';
import { PubChemService } from '../../src/services/pubchem.service';

const compoundsService = new CompoundsService(new PubChemService());

describe('Compounds Service', () => {
  it('should return an observable of a full dataset', (done) => {
    const dataset = [
      {
        CAS: '471-84-1',
        IUPAC: 'alpha-fenchene',
      },
    ];

    compoundsService.buildCompounds(dataset).subscribe(completeDataset => {
      completeDataset.length.should.equal(1);
      completeDataset[0].should.have.ownProperty('CAS');
      completeDataset[0].should.have.ownProperty('CIDs');
      completeDataset[0].should.have.ownProperty('pubchemAssayCount');
      completeDataset[0].should.have.ownProperty('pubchemPathwayCount');
    }, null, () => done());
  });

  it('Should resolve. (THIS IS A BAD TEST. SHOULD DUMMY MONGODB)', (done) => {
    const dataset = [
      {
        CAS: '471-84-1',
        IUPAC: 'alpha-fenchene',
      },
    ];

    compoundsService.create('test', 'jacob', dataset).should.eventually.be.undefined.notify(done);
  });
});
