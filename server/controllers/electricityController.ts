import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import pool from '../model/carbonCompassModel.js'
import { v4 as uuidv4 } from 'uuid';

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
  const newUUID = uuidv4();
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

    //*  SQL Insertion
    // * ////////////////////////////////////

    const roundedDownCarbon_kg = Math.floor(carbon_kg)
    const roundedDownElectricity_value = Math.floor(electricity_value)

    const result = await pool.query(`INSERT INTO electricity_emissions (electricity_emissions_id, session_id, country, state, kwh, estimate_emissions) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [newUUID, "7ac8d3ed-04a9-4648-914c-5f0fab2e6f05",country,state,roundedDownElectricity_value,roundedDownCarbon_kg]);
    console.log("result of SQL insertion in electric controller", result.rows[0])
    // * ////////////////////////////////////

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