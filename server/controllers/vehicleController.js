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
};

export default vehicleController;