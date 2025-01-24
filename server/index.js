// * SERVER * //

import express from 'express';
import { flushSync } from 'react-dom';
import fs from 'fs'
import offsetPrograms from './offsetPrograms.js'
const app = express();
const PORT = process.env.PORT || 3000;

// * MIDDLEWARE
app.use(express.json());

// * ROUTES
// !Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Our Carbon Emissions/Offset project server is live!' });
});





// POST endpoint to add new offset programs
app.post('/api/offset-programs', (req,res)=> {
  const newProgram = req.body;

  if (!newProgram.name || !newProgram.link || !newProgram.description) {
    return res.status(400).json({error: 'All fields (name, link, description) are required.'})
  }
  // unique ID for new program
  newProgram.id = offsetPrograms.length + 1;
  offsetPrograms.push(newProgram);

  // save updated data to file
  fs.writeFileSync('./offsetPrograms.js', `module.exports = ${JSON.stringify(offsetPrograms, null, 2)};`);

  res.status(201).json(newProgram);
});


// * START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
