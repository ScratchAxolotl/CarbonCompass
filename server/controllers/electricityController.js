import axios from 'axios';
const electricityController = {};

electricityController.getEmissions = async (req, res, next) => {
  try {
    const {type, country, state, electricity_unit, electricity_value} = req.body;
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
    const emissionsData = {carbon_lb, carbon_kg};
    console.log('emissionsData', emissionsData);
    res.locals.emissionsData = emissionsData;
    return next();
  } catch (error) {
    console.error('Error creating carbon estimate:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
};

export default electricityController;