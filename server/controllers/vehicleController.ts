import axios from 'axios';
const vehicleController = {};

vehicleController.getMakes = async (req, res, next) => {
  try {
    const response = await axios.get(
      'https://www.carboninterface.com/api/v1/vehicle_makes',
      {
        headers: {
          Authorization: 'Bearer 11UjdqrI0oFfPbmU2GTWVQ',
          'Content-Type': 'application/json'
        }
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
};
vehicleController.getModels = async (req, res, next) => {
  const { makeId } = req.params;
  try {
    const response = await axios.get(
      `https://www.carboninterface.com/api/v1/vehicle_makes/${makeId}/vehicle_models`,
      {
        headers: {
          Authorization: 'Bearer 11UjdqrI0oFfPbmU2GTWVQ',
          'Content-Type': 'application/json'
        }
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
};

vehicleController.getEmissions = async (req,res,next) => {
  // controller for getting vehicle emissions calculation from the front end
  try {
    const { type, distance_unit, distance_value, vehicle_model_id } = req.body;
    const response = await axios.post(
      'https://www.carboninterface.com/api/v1/estimates',
      { type, distance_unit, distance_value, vehicle_model_id },
      {
        headers: {
          Authorization: 'Bearer 11UjdqrI0oFfPbmU2GTWVQ',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data);
    const carbon_lb = response.data.data.attributes.carbon_lb;
    const carbon_kg = response.data.data.attributes.carbon_kg;
    const emissionsData = {carbon_lb, carbon_kg};

    res.locals.vehicleModels = emissionsData;
    console.log('res.locals.vehicleModels', res.locals.vehicleModels);

    return next();
  } catch (error) {
    console.error('Error creating carbon estimate:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
};

export default vehicleController;