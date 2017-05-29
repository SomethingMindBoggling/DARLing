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

  it('Should return a list of IDs, given multiple CIDs', (done) => {
    const CIDs = [28930, 585182];
    metaCycService.getBioCycIDFromCIDs(CIDs).subscribe((val) => {
      val.length.should.be.above(1);
    }, null, done);
  });

  it('Should return an empty list for this one', (done) => {
    metaCycService.getBioCycIDFromCIDs([9380932802304823094803284]).subscribe((val) => {
      val.length.should.equal(0);
    }, null, done);
  });

  it('Should return a count of at least two for the pathways', (done) => {
    const bioCycIDs = ['CPD-12222'];
    metaCycService.getPathwayCount(bioCycIDs).subscribe((val) => {
      val.should.be.above(1); // Count from 29/5/17
    }, null, done);
  });

  it('Should return a count of the pathways for multiple IDs too', (done) => {
    const bioCycIDs = ['CPD-12222', 'CPD-13228'];
    metaCycService.getPathwayCount(bioCycIDs).subscribe((val) => {
      val.should.be.above(2); // Count from 29/5/17
    }, null, done);
  });

  it('Should return a 0 count if a non-existent bioCyc ID is given', (done) => {
    const bioCycIDs = ['jacob\'s-nonsense-id'];
    metaCycService.getPathwayCount(bioCycIDs).subscribe((val) => {
      val.should.equal(0);
    }, err => {
      console.log(err);
      done();
    }, done);
  });

  it('Should return a count of the reactions', (done) => {
    const bioCycIDs = ['CPD-12222'];
    metaCycService.getReactionsCount(bioCycIDs).subscribe(val => {
      val.should.be.above(1); // Count from 29/5/17
    }, null, done);
  });

  it('Should return a count of the pathways for multiple IDs too', (done) => {
    const bioCycIDs = ['CPD-12222', 'CPD-13228'];
    metaCycService.getReactionsCount(bioCycIDs).subscribe((val) => {
      val.should.be.above(2); // Count from 29/5/17
    }, null, done);
  });

  it('Should return a 0 count if a non-existent bioCyc ID is given', (done) => {
    const bioCycIDs = ['jacob\'s-nonsense-id'];
    metaCycService.getReactionsCount(bioCycIDs).subscribe((val) => {
      val.should.equal(0);
    }, null, done);
  });
});
