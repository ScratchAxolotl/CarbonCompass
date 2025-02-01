import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

// const electricityController = {};



interface ElectricityRequestBody{
  type: string;
  electricity_unit: string; 
  electricity_value: number;
  country: string;
  state: string;  
}

interface ElectricityController {
  getEmissions: (
    req: Request<{}, {}, ElectricityRequestBody>,
    res: Response,
     next: NextFunction
  ) => Promise<void | Response>;
}



const electricityController: ElectricityController = {
  getEmissions: async (req: Request, res: Response, next: NextFunction )  => {
  try {
    const {type, country, state, electricity_unit, electricity_value} = req.body;

    if (!type || !country || !state || !electricity_unit || !electricity_value) {
      return res.status(400).json({message: "Missing required fields in request body"})
    }

    const response = await axios.post(
      'https://www.carboninterface.com/api/v1/estimates',
      {type, electricity_unit, electricity_value, country, state},
      {
        headers: {
          Authorization: 'Bearer 11UjdqrI0oFfPbmU2GTWVQ',
          'Content-Type': 'application/json'
        }
      }
    );

    const { carbon_lb, carbon_kg } = response.data.data.attributes

    const emissionsData = { carbon_lb, carbon_kg };

    console.log('Electricity emissionsData', emissionsData);

    res.locals.emissionsData = emissionsData;
    return next();
  } catch (error) {
    console.error('Error creating carbon estimate:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
   }
  }
};

export default electricityController;