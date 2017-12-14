import { PubChemService } from '../../src/server/services/pubchem.service';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();

describe('PubChem Service', () => {
  const pubchemService = new PubChemService();

  it('Should return a list of only one CID', (done) => {
    pubchemService.getCIDs('492-62-6').subscribe(CIDs => {
      CIDs.length.should.equal(1);
      CIDs[0].should.equal(79025);
    }, null, done);
  });

  it('Should return an empty list', (done) => {
    pubchemService.getCIDs('1334-78-7').subscribe(CIDs => {
      CIDs.length.should.equal(0);
    }, null, done);
  });

  it('Should return a list of at least three CIDs', (done) => {
    pubchemService.getCIDs('79-68-5').subscribe(CIDs => {
      CIDs.length.should.be.above(2);
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

  it('Should still return an assay count for multiple CIDs', (done) => {
    pubchemService.getAssayCount([6433146, 11458409, 56632788]).subscribe(count => {
      count.should.be.above(-1); // Number on 29/05/17
    }, null, done);
  });

  it('Should return an assay count of 0 for non-existent CID', (done) => {
    pubchemService.getAssayCount(['Jacob\'s-stupid-id']).subscribe(count => {
      count.should.equal(0);
    }, null, done);
  });

  it('Should still return a pathway count for multiple CIDs', (done) => {
    pubchemService.getPathwayCount([6433146, 11458409, 56632788]).subscribe(count => {
      count.should.be.above(-1); // Number on 29/05/17
    }, null, done);
  });

  it('Should return a pathway count of 0 for non-existent CID', (done) => {
    pubchemService.getPathwayCount(['Jacob\'s-stupid-id']).subscribe(count => {
      count.should.equal(0);
    }, null, done);
  });
});
