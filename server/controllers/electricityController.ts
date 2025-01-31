import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

// const electricityController = {};
const electricityController: { [key: string]: any } = {}


interface ElectricityRequestBody{
  type: string;
  electricity_unit: string; 
  electricity_value: number;
  country: string;
  state: string;  
}

interface ElectricityResponseBody{
  carbon_lb: number;
  carbon_kg: number;
}



electricityController.getEmissions = async (
  req: Request<{}, {}, ElectricityRequestBody>,
    res: Response,
     next: NextFunction ) => {
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

    const carbon_lb = response.data.data.attributes.carbon_lb;
    const carbon_kg = response.data.data.attributes.carbon_kg;
    const emissionsData = { carbon_lb, carbon_kg };

    console.log('Electricity emissionsData', emissionsData);

    res.locals.emissionsData = emissionsData;
    return next();
  } catch (error) {
    console.error('Error creating carbon estimate:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
};

export default electricityController;