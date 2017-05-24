import { CompoundsService } from './services/compounds.service';
import { PubChemService } from './services/pubchem.service';

const compoundService = new CompoundsService(new PubChemService());

// Grab env variables
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API ROUTES
// ==========
app.get('compounds', (req, res) => {
  // Return a list of all compound datasets in the database
  // [{id, name, owner},...]
});

app.get('compounds/:id', (req, res) => {
  // Return a list of the details for each compound in the dataset
  // [{id, CAS, CID, IUPAC, pubchem_assay_count, pubchem_pathway_count...},...]
});

app.post('/compounds', (req, res) => {
  // Create a new dataset
  // Post data: {name, owner, dataset: [{CAS, IUPAC}]
  const dataset = JSON.parse(req.body.dataset);

  compoundService.create(req.body.name, req.body.owner, dataset)
    .then(() => res.json({ message: 'Compounds set created!' }))
    .catch(res.send);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
