// * SERVER * //

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
import electricityController from './controllers/electricityController.js';


// * MIDDLEWARE
app.use(express.json());

// * ROUTES
app.post('/api/electricity', electricityController.getEmissions, (req, res) => {
  res.status(200).json(res.locals.emissionData);
});

// * ROUTES
// !Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Our Carbon Emissions/Offset project server is live!' });
});

// * START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
