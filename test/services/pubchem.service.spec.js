import { PubChemService } from '../../src/services/pubchem.service';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

describe('PubChem Service', () => {
  const pubchemService = new PubChemService();

  it('Should return a list of only one CID', (done) => {
    pubchemService.getCID('492-62-6').subscribe(CIDs => {
      CIDs.length.should.equal(1);
      CIDs[0].should.equal(79025);
    }, null, done);
  });

  it('Should return a count of the bioassays', (done) => {
    pubchemService.getAssayCount([79025]).subscribe(count => {
      count.should.be.above(10); // Number on 29/05/17
    }, null, done);
  });

  it('Should return a count of the pathways', (done) => {
    pubchemService.getPathwayCount([79025]).subscribe(count => {
      count.should.be.above(42000); // Number on 29/05/17
    }, null, done);
  });
});
