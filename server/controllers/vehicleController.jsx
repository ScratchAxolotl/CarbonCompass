import axios from 'axios';
const vehicleController = {};

vehicleController.getEmissions = async (req, res, next) => {
  try {
    const response = await axios.get(
      'https://www.carboninterface.com/api/v1/estimates',
      {
        type: 'vehicle',
        electricity_unit: 'mwh',
        electricity_value: 42,
        country: 'us',
        state: 'fl'
      },
      {
        headers: {
          Authorization: 'Bearer 11UjdqrI0oFfPbmU2GTWVQ',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data.data.attributes.carbon_lb);
    console.log(response.data.data.attributes.carbon_kg);
    const carbon_lb = response.data.data.attributes.carbon_lb;
    const carbon_kg = response.data.data.attributes.carbon_kg;
    const emissionsData = {carbon_lb, carbon_kg};
    console.log(emissionsData);
    res.locals.emissionData = emissionsData;

  } catch (error) {
    console.error('Error creating carbon estimate:', error.message);
    res.status(500).json({ error: 'Error fetching data' });
  }
};

export default electricityController;