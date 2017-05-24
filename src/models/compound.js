const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export const Compound = mongoose.model('Compound', new Schema({
  id: Number,
  CAS: Number,
  IUPAC: String,
  pubchemAssayCount: Number,
  pubchemPathwayCount: Number,
}));
