import axios from 'axios';
import pool from '../model/carbonCompassModel.js'
import { v4 as uuidv4 } from 'uuid';

import { Request, Response, NextFunction } from 'express';

interface VehicleRequestBody {
  type: string;
  distance_unit: string;
  distance_value: number;
  vehicle_model_id: string;
}

interface VehicleController {
  getMakes: (
    req: Request<{}, {}, VehicleRequestBody>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;

  getModels: (
    req: Request<{}, {}, VehicleRequestBody>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;

  getEmissions: (
    req: Request<{}, {}, VehicleRequestBody>,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

const vehicleController: VehicleController = {
  getMakes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await axios.get(
        'https://www.carboninterface.com/api/v1/vehicle_makes',
        {
          headers: {
            Authorization: 'Bearer IjDMYGZHSI4y3gYMoxQYqQ',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);

      res.locals.vehicleMakes = response.data;

      return next();
    } catch (error) {
      return next(error);
      // console.error('Error getting vehicle makes:', error.message);
      // res.status(500).json({ error: 'Error fetching data' });
    }
  },

  getModels: async (req: Request, res: Response, next: NextFunction) => {
    const { makeId } = req.params;
    try {
      const response = await axios.get(
        `https://www.carboninterface.com/api/v1/vehicle_makes/${makeId}/vehicle_models`,
        {
          headers: {
            Authorization: 'Bearer IjDMYGZHSI4y3gYMoxQYqQ',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);

      res.locals.vehicleModels = response.data;

      return next();
    } catch (error) {
      return next(error);
      // console.error('Error getting vehicle makes:', error.message);
      // res.status(500).json({ error: 'Error fetching data' });
    }
  },
  getEmissions: async (req: Request, res: Response, next: NextFunction) => {
    // controller for getting vehicle emissions calculation from the front end
    const newUUID = uuidv4();
    try {
      const { type, distance_unit, distance_value, vehicle_model_id } =
        req.body;
      const response = await axios.post(
        'https://www.carboninterface.com/api/v1/estimates',
        { type, distance_unit, distance_value, vehicle_model_id },
        {
          headers: {
            Authorization: 'Bearer IjDMYGZHSI4y3gYMoxQYqQ',
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response.data);
      const carbon_lb = response.data.data.attributes.carbon_lb;
      const carbon_kg = response.data.data.attributes.carbon_kg;
      const emissionsData = { carbon_lb, carbon_kg };

      //*  SQL Insertion
      // * ////////////////////////////////////

      const roundedDownCarbon_kg = Math.floor(carbon_kg)
      const roundedDowndistance_value = Math.floor(distance_value)

      const result = await pool.query(`INSERT INTO vehicle_emissions (vehicle_emissions_id, session_id, vehicle_model_id, unit, units_driven, estimate_emissions) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [newUUID, "7ac8d3ed-04a9-4648-914c-5f0fab2e6f05",vehicle_model_id,distance_unit,roundedDowndistance_value,roundedDownCarbon_kg]);
      console.log("result of SQL insertion in electric controller", result.rows[0])
      // * ////////////////////////////////////

      res.locals.vehicleModels = emissionsData;
      console.log('res.locals.vehicleModels', res.locals.vehicleModels);

      return next();
    } catch (error) {
      if (error instanceof Error)
      console.error('Error creating carbon estimate:', error.message);
      res.status(500).json({ error: 'Error fetching data' });
    }
  },
};

export default vehicleController;
