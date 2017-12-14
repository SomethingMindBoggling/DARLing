const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

import { CompoundsService } from '../../src/server/services/compounds.service';
import { PubChemService } from '../../src/server/services/pubchem.service';
import { MetaCycService } from '../../src/server/services/metacyc.service';
import { QueueService } from '../../src/server/services/queue.service';

const compoundsService = new CompoundsService(
  new PubChemService(),
  new MetaCycService(),
  new QueueService()
);

describe('Compounds Service', () => {
  it('should return an observable of a full dataset', (done) => {
    const dataset = [
      {
        CAS: '1334-78-7',
        IUPAC: 'tolualdehyde ui',
      },
      {
        CAS: '1334-78-7',
        IUPAC: 'tolualdehyde ui',
      },
    ];

    compoundsService.buildCompounds(dataset).subscribe(completeDataset => {
      completeDataset.length.should.equal(2);

      // First compound has counts for everything
      completeDataset[0].should.have.ownProperty('CAS');
      completeDataset[0].should.have.ownProperty('IUPAC');
      completeDataset[0].should.have.ownProperty('pubChem');
      completeDataset[0].pubChem.should.have.ownProperty('IDs');
      completeDataset[0].pubChem.should.have.ownProperty('assayCount');
      completeDataset[0].pubChem.should.have.ownProperty('pathwayCount');
      completeDataset[0].should.have.ownProperty('metaCyc');
      completeDataset[0].metaCyc.should.have.ownProperty('IDs');
      completeDataset[0].metaCyc.should.have.ownProperty('reactionCount');
      completeDataset[0].metaCyc.should.have.ownProperty('pathwayCount');

      // Second compound has no count results
      completeDataset[1].should.have.ownProperty('CAS');
      completeDataset[1].should.have.ownProperty('IUPAC');
      completeDataset[1].should.have.ownProperty('pubChem');
      completeDataset[1].pubChem.should.have.ownProperty('IDs');
      completeDataset[1].pubChem.IDs.length.should.equal(0);
      completeDataset[1].pubChem.should.have.ownProperty('assayCount');
      completeDataset[1].pubChem.assayCount.should.equal(0);
      completeDataset[1].pubChem.should.have.ownProperty('pathwayCount');
      completeDataset[1].pubChem.pathwayCount.should.equal(0);
      completeDataset[1].should.have.ownProperty('metaCyc');
      completeDataset[1].metaCyc.should.have.ownProperty('IDs');
      completeDataset[1].metaCyc.IDs.length.should.equal(0);
      completeDataset[1].metaCyc.should.have.ownProperty('reactionCount');
      completeDataset[1].metaCyc.reactionCount.should.equal(0);
      completeDataset[1].metaCyc.should.have.ownProperty('pathwayCount');
      completeDataset[1].metaCyc.pathwayCount.should.equal(0);
    }, null, done);
  });

  it('should return an observable of a full dataset that has no results', (done) => {
    const dataset = [
      {
        CAS: '1334-78-7',
        IUPAC: 'tolualdehyde ui',
      },
    ];

    compoundsService.buildCompounds(dataset).subscribe(completeDataset => {
      completeDataset.length.should.equal(1);
      // Second compound has no count results
      completeDataset[0].should.have.ownProperty('CAS');
      completeDataset[0].should.have.ownProperty('IUPAC');
      completeDataset[0].should.have.ownProperty('pubChem');
      completeDataset[0].pubChem.should.have.ownProperty('IDs');
      completeDataset[0].pubChem.IDs.length.should.equal(0);
      completeDataset[0].pubChem.should.have.ownProperty('assayCount');
      completeDataset[0].pubChem.assayCount.should.equal(0);
      completeDataset[0].pubChem.should.have.ownProperty('pathwayCount');
      completeDataset[0].pubChem.pathwayCount.should.equal(0);
      completeDataset[0].should.have.ownProperty('metaCyc');
      completeDataset[0].metaCyc.should.have.ownProperty('IDs');
      completeDataset[0].metaCyc.IDs.length.should.equal(0);
      completeDataset[0].metaCyc.should.have.ownProperty('reactionCount');
      completeDataset[0].metaCyc.reactionCount.should.equal(0);
      completeDataset[0].metaCyc.should.have.ownProperty('pathwayCount');
      completeDataset[0].metaCyc.pathwayCount.should.equal(0);
    }, null, done);
  });

  it('Should resolve. (THIS IS A BAD TEST. SHOULD DUMMY MONGODB)', (done) => {
    const dataset = [
      {
        CAS: '471-84-1',
        IUPAC: 'alpha-fenchene',
      },
    ];

    compoundsService.create('test', 'jacob', dataset).should.eventually
      .equal('Your compounds set has been added to the queue and will be processed shortly.')
      .notify(done);
  });

  it('Should resolve with a single compound set. (BAD TEST. DUMMY MONGODB)', (done) => {
    compoundsService.get('59260708834f0d4873f127fa').should.eventually.notify(done);
  });
});
