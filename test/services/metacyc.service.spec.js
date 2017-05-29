import { MetaCycService } from '../../src/services/metacyc.service';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();


describe('MetaCyc Service', () => {
  const metaCycService = new MetaCycService();

  it('Should return a list of IDs', (done) => {
    const CIDs = [28930];
    metaCycService.getBioCycIDFromCIDs(CIDs).subscribe((val) => {
      val.length.should.equal(1);
      val[0].should.equal('CPD-12222');
    }, null, done);
  });

  it('Should return a count of the pathways', (done) => {
    const bioCycIDs = ['CPD-12222'];
    metaCycService.getPathwayCount(bioCycIDs).subscribe((val) => {
      val.should.be.above(0);
    }, null, done);
  });

  it('Should return a count of the reactions', (done) => {
    const bioCycIDs = ['CPD-12222'];
    metaCycService.getReactionsCount(bioCycIDs).subscribe(val => {
      val.should.be.above(0);
    }, null, done);
  });
});
