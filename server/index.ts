// * SERVER * //
import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import offsetPrograms from './offsetPrograms.ts';
import openAiController from './controllers/openAiController.ts';

// * INITIALIZE .ENV FILE
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
import electricityController from './controllers/electricityController.ts';
import vehicleController from './controllers/vehicleController.ts';

// * MIDDLEWARE

// * CORS
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

// * ROUTE - ELECTRICITY
app.post('/api/electricity', electricityController.getEmissions, (req, res) => {
  res.status(200).json(res.locals.emissionsData);
});

// * ROUTE - VEHICLES
// on input form page load, get the vehicle makes for client selection (complete)
app.get('/api/vehicle/makes', vehicleController.getMakes, (req, res) => {
  res.status(200).json(res.locals.vehicleMakes);
});
// on make selection, get the vehicle makes for client selection (complete)
app.get(
  '/api/vehicle/makes/:makeId',
  vehicleController.getModels,
  (req, res) => {
    res.status(200).json(res.locals.vehicleModels);
  }
);
// *TODO the client will send a request on submit to get the emissions data from the form (incomplete)
app.post('/api/vehicle', vehicleController.getEmissions, (req, res) => {
  res.status(200).json(res.locals.vehicleModels);
});

// * ROUTE - OPENAI
app.post('/api/openai/', openAiController.generateResponse, (req, res) => {
  res.status(200).json({ aiResponse: res.locals.aiResponse });
});

// * START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
