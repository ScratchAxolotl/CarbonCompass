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
  ) => Promise<void>;
}



const electricityController: ElectricityController = {
  getEmissions: async (req: Request, res: Response, next: NextFunction )  => {
  try {
    const {type, country, state, electricity_unit, electricity_value} = req.body;

    if (!type || !country || !state || !electricity_unit || !electricity_value) {
      res.status(400).json({message: "Missing required fields in request body"})
      return;
    }

    const response = await axios.post(
      'https://www.carboninterface.com/api/v1/estimates',
      {type, electricity_unit, electricity_value, country, state},
      {
        headers: {
          Authorization: 'Bearer IjDMYGZHSI4y3gYMoxQYqQ',
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
    if (error instanceof Error)
    console.error('Error creating carbon estimate:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
   }
  }
};

export default electricityController;