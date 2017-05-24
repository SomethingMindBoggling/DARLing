const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export const CompoundSet = mongoose.model('CompoundSet', new Schema({
  id: Number,
  name: String,
  owner: String,
  compounds: [{
    id: Number,
    CAS: String,
    IUPAC: String,
    CIDs: [String],
    pubchemAssayCount: Number,
    pubchemPathwayCount: Number,
  }],
}));
