// * SERVER * //
import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import offsetPrograms from './offsetPrograms.js';
import openAiController from './controllers/openAiController.js';

// * INITIALIZE .ENV FILE
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
import electricityController from './controllers/electricityController.js';

// * MIDDLEWARE
app.use(express.json());

// ! * ROUTE - TEST - To be DELETED
app.get('/api/test', (req, res) => {
  res.json({ message: 'Our Carbon Emissions/Offset project server is live!' });
});

// * ROUTE - ELECTRICITY
app.post('/api/electricity', electricityController.getEmissions, (req, res) => {
  res.status(200).json(res.locals.emissionData);
});

// * ROUTE - OPENAI
app.post('/api/openai/', openAiController.generateResponse, (req, res) => {
  res.status(200).json({ aiResponse: res.locals.aiResponse });
});

// POST endpoint to add new offset programs
// needs a 1sec cooldown
app.post('/api/offset-programs', (req, res) => {
  const newProgram = req.body;

  if (!newProgram.name || !newProgram.link || !newProgram.description) {
    return res
      .status(400)
      .json({ error: 'All fields (name, link, description) are required.' });
  }
  // unique ID for new program
  newProgram.id = offsetPrograms.length + 1;
  offsetPrograms.push(newProgram);

  // save updated data to file
  fs.writeFileSync(
    './offsetPrograms.js',
    `const offsetPrograms = ${JSON.stringify(offsetPrograms, null, 2)};
  \n export default offsetPrograms;`
  );

  res.status(201).json(newProgram);
});

// * START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
