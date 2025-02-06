import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import OffsetPrograms from "./OffsetPrograms.jsx";


// *** submitForm note: add unit for electricity kilowatts, watts, megawatts. currently hard codeded with kw.
// note:248 check logic

interface Make {
  data: {
    attributes: {
      name: string;
    }
    id: string;
  };
}

interface Model {
  data: {
    attributes: {
      name: string;
      year: number;
    }
    id: string;
  };
}

interface EmissionsAPiResponse {
  carbon_lb: number;
  carbon_kg: number;
}

interface VehicleEmissionRequest {
  type: string; // Always 'vehicle'
  distance_unit: string; // Only allows 'mi' or 'km'
  distance_value: number; // Distance as a number (decimal)
  vehicle_model_id: string; // The vehicle model's ID
}

interface ElectricityEmissionRequest {
  type: string;
  country: string;
  state: string;
  electricity_unit: string;
  electricity_value: number | string;
}


// export default function ClientForm()
const ClientForm: React.FC = () => {
  const [makes, setMakes] = useState<Make[]>([]); // type of modles data interface Make
  const [models, setModels] = useState<Model[]>([]); 

  const [makeOptions, setMakeOptions] = useState<JSX.Element[] | undefined>(); // show name of make. send back ID
  const [modelOptions, setModelOptions] = useState<JSX.Element[] | undefined>(); // show name and year of model conditionaly when make is selected. send back ID 

  // might be a problem with distance value is string and then needs to be converted to a number in request body 
  const [distance, setDistance] = useState<string>(''); // getting ready to submit. adds distance to request

  // might need to fix starting value of undefined 
  const [distanceUnit, setDistanceUnit] = useState<string | undefined>(undefined); // submit once distance unit selected. adds unit to request. initially undefined until user selects unit.
  // vehicleModelId starts with an empty string or undefined. once model selected, store model ID as string
  const [vehicleModelId, setVehicleModelId] = useState<string | undefined>(''); // take model ID selected and add to request body. vehicleModelId = Id of model 

  // not sure is powerUsage type is a number or a string
  const [powerUsage, setPowerUsage] = useState<string | number>(0); // add powerUsage to request. updates state with new powerUsage number

  const [country, setCountry] = useState<string | undefined>(''); // displays country list and only works if country is US or CA. 
  const [subregion, setSubregion] = useState<string>('');

  const [emissionType, setEmissionType] = useState<string>('');

  // Initially, emissionsElec is null holding no data and later holds API reponse
  // updates current emissions data for conditionaly based rendering of UI visibility.
  const [emissionsElec, setEmissionsElec] = useState<EmissionsAPiResponse | string | number>(''); // stores electricity emissionJsonData and updates the most current electricity emissions data from API
  const [emissionsVeh, setEmissionsVeh] = useState<EmissionsAPiResponse | string | number >(''); // stores vehicle emissionJsonData and updates the most current vehicle emissions data from API

  const [showEmissionsElec, setShowEmissionsElec] = useState<string| number | EmissionsAPiResponse>('');
  const [showEmissionsVeh, setShowEmissionsVeh] = useState<string| number | EmissionsAPiResponse >('');

  // function selectEmissionType(){
  //   setEmissionType(e.target.value)
  // }

  async function getMakes() {
    const url = '/api/vehicle/makes';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      // await setMakes( response.json());
      const jsonData = await response.json();

      setMakes(jsonData);

      // console.log('one model:',makes.data.attributes.name)
      // console.log('makes state:', makes)
     // if instance iof 
    } catch (err) {
      if (err instanceof Error)
      console.log(err.message);
    }
  }




// after user selects make, event listener listens for call getModels
  async function getModels(e: ChangeEvent<HTMLSelectElement>) {
    // console.log('current selection:',e.target.value);
    const url = `/api/vehicle/makes/${e.target.value}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      // console.log('fetching models...')
      // await setMakes( response.json());
      const jsonData = await response.json();
      // console.log('setting models state...')
      setModels(jsonData);
      // console.log('modelsState:', json);

      // console.log('one model:',makes.data.attributes.name)
      // console.log('models state:', models)
    } catch (err) {
      if (err instanceof Error)
      console.log(err.message);
    }
  }
  function changeAmount(e: ChangeEvent<HTMLInputElement>) {
    setPowerUsage(e.target.value);
    // console.log('amount',powerUsage);
  }
  function countrySelection(e: ChangeEvent<HTMLSelectElement>) {
    setCountry(e.target.value);
    console.log('country:', e.target.value);
  }
  function stateSelection(e: ChangeEvent<HTMLSelectElement>) {
    setSubregion(e.target.value);
    console.log('subregion:', subregion);
  }
  function subRegionsVis() {
    const stateOptions = document.getElementById('state-options');
  const stateLabel = document.getElementById('state-label');


  const provinceLabel = document.getElementById('province-label');
  const provinceOptions = document.getElementById('province-options');



    if (country === 'US') {
      if (stateOptions) stateOptions.style.visibility = 'visible';
      if (stateLabel) stateLabel.style.visibility = 'visible';
      if (provinceLabel) provinceLabel.style.visibility = 'hidden';
      if (provinceOptions) provinceOptions.style.visibility = 'hidden';
    } else if (country === 'CA') {
      if (provinceOptions) provinceOptions.style.visibility = 'visible';
      if (provinceLabel) provinceLabel.style.visibility = 'visible';
      if (stateLabel) stateLabel.style.visibility = 'hidden';
      if (stateOptions) stateOptions.style.visibility = 'hidden';
    } else {
      if (provinceLabel) provinceLabel.style.visibility = 'hidden';
      if (stateLabel) stateLabel.style.visibility = 'hidden';
      if (provinceOptions) provinceOptions.style.visibility = 'hidden';
      if (stateOptions) stateOptions.style.visibility = 'hidden';
    }
  }


  async function submitVehicleForm(e?: FormEvent<HTMLFormElement>) {
      const url = `/api/vehicle`;

      if (!distanceUnit || !distance || !vehicleModelId) {
        console.error('Missing required fields for Vehicle emissions');
        return;
      }

      const requestBody: VehicleEmissionRequest = {
        type: 'vehicle',
      distance_unit: distanceUnit,
      distance_value: parseFloat(distance), // Convert string to number
      vehicle_model_id: vehicleModelId,
    };

      const request = {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
  }

  try {
    //  console.log('req:', request);
      const response = await fetch(url, request);
      if (!response.ok) {
        throw new Error(`Vehicle Response Status : ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('res:', jsonData);
      setEmissionsVeh(jsonData);
    } catch (err) {
      if (err instanceof Error)
      console.log(err.message);
    }
  }


  async function submitElectricityForm(e?: FormEvent<HTMLFormElement>) {
    const url = `/api/electricity`;
    if (!country || !subregion || !powerUsage) {
      console.error('Missing required fields for Electricity emissions');
      return;
    }

    const requestBody: ElectricityEmissionRequest = {
      type: 'electricity',
      country: country,
      state: subregion,
      electricity_unit: 'kwh',
      electricity_value: powerUsage,
    };

    const request = {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
  }

  try {
    //  console.log('req:', request);
      const response = await fetch(url, request);
      if (!response.ok) {
        throw new Error(`Electricity Response Status : ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('res:', jsonData);
      setEmissionsElec(jsonData);
    } catch (err) {
      if (err instanceof Error)
      console.log(err.message);
    }
}



  // this is making sure that emissionsElec, emissionsVeh, and emissionsType update before running their respective functions
  useEffect(() => {
    setShowEmissionsElec(emissionsElec); // updates states with latest emission data
    setShowEmissionsVeh(emissionsVeh); // before checking conditions

    console.log('e', showEmissionsElec);
    console.log('v', showEmissionsVeh);

    console.log('e2', showEmissionsElec);
    console.log('v2', emissionsElec);

    const vehEmissionsElement = document.getElementById('veh-emissions');
    const elecEmissionsElement = document.getElementById('elec-emissions');
      // Vehicle Emissions Visibility
      if (vehEmissionsElement) {
        if (emissionsVeh && emissionType === 'vehicle') {
            vehEmissionsElement.style.visibility = 'visible';
        } else {
            vehEmissionsElement.style.visibility = 'hidden';
        }
    }

  
    if (elecEmissionsElement) {
      if (emissionsElec && emissionType === 'electricity') {
        elecEmissionsElement.style.visibility = 'visible';
      } else {
        elecEmissionsElement.style.visibility = 'hidden';
      }
    }
  }, [emissionsElec, emissionsVeh]);// [[jsonData], [jsonData]]

  // this checks for what country you select so that you can choose the subregions for USA and Canada
  useEffect(() => {
    subRegionsVis();
  });
// **** need to split useEffect into 2. one for vehicles and one for electricity.
  // useEffect(() => {
  //   submitForm();
  // }, [emissionType]);

  // useEffect for Vehicles
  useEffect(() => {
    if (emissionType === 'vehicle' && makes && models && distance && distanceUnit && vehicleModelId) {
      submitVehicleForm();
    } else {
      console.log('vehicle useEffect not working')
    }
  }, [emissionType, makes, models, distance, distanceUnit, vehicleModelId]);

  useEffect(() => {
    if (emissionType === 'electricity' && country && powerUsage && subregion) {
    submitElectricityForm();
    }else {
      console.log('electricity useEffect not working')
    }
  }, [emissionType, country, subregion, powerUsage]);

  // this does the fetch for the makes
  useEffect(() => {
    getMakes();
  }, []);

  // This creates the makes options array for the makes dropdown
  useEffect(() => {
    if (makes.length > 0) {
      const makesArr = makes // makes=[{ data: { attributes: { name: "Toyota" }, id: "123" } },
                             // { data: { attributes: { name: "Honda" }, id: "456" } },];
        .map((makes) => {
          return [makes.data.attributes.name, makes.data.id]; // makesArr = [[name],[id]], [[Toyota],[123]], ...
        })
        .sort();
        
      const sortedMakesArr = makesArr.map((sMakes, i) => {
        return (
          <option key={i} value={sMakes[1]}>
            {sMakes[0]}
          </option>
        );
      }); // value={sMakes[1]} --> sends ID when user selects option



      setMakeOptions(sortedMakesArr);
      // console.log('compree', makes);
      // console.log('makeOptionArr', makeOptions);
    }
    // console.log('makeOptions:',makes);
  }, [makes]); // dependency array. rerun whenever makes changes. [makes] = jsonData after fetch


  // CREATE THE MODELS OPTIONS ARRAY FOR THE MODELS DROPDOWN
  useEffect(() => {
    // console.log('creating model options array...')
    if (models.length > 0) { // getModels(e) is populated with jsonData
      //unhide the model selector
      const modelOptionsElement = document.getElementById('model-options');
      const modelLabelElement = document.getElementById('model-label');

      if (modelOptionsElement) {
        modelOptionsElement.style.visibility = 'visible';
      }
      if (modelLabelElement) {
        modelLabelElement.style.visibility = 'visible';
      }


      // console.log('model0:',models[0])
      const modelsArr = models
        .map((models) => {
          return [
            models.data.attributes.name,
            models.data.attributes.year,
            models.data.id,
          ];
        })
        .sort();
      // console.log(modelsArr);

      const sortedModelsArr = modelsArr.map((sModels, i) => {
        return (
          <option
            key={i}
            value={sModels[2]}
          >{`${sModels[0]} ${sModels[1]}`}</option>
        ); // show name and year of car model and send back ID
      });

      console.log(sortedModelsArr);

      setModelOptions(sortedModelsArr);
      // console.log('compree', models);
      // console.log('modelOptionsArr', modelOptions);
    } else {

        //unhide the model selector
        const modelOptionsElement = document.getElementById('model-options');
        const modelLabelElement = document.getElementById('model-label');
  
        if (modelOptionsElement) {
          modelOptionsElement.style.visibility = 'hidden';
        }
        if (modelLabelElement) {
          modelLabelElement.style.visibility = 'hidden';
        }
    }
  }, [models]); // listen for a change in [models] --> models jsonData 

  return (
    <div id='mainDiv'>
      <div id='vehicle-form'>
        <h1>How far U drive?</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmissionType('vehicle'); // triggers `useEffect` for vehicle submission
          }}
        >
          {/* SELECT THE VEHICLE MAKE AND AFTER THE CLIENT CLICKS AN OPTION, SERVE THE MODELS */}
          <label>Select Vehicle Make</label>
          <select
            onChange={(e) => getModels(e)}
            className='form-select'
            autoComplete='vehicle'
            id='make-options'
          >
            <option value=''>Vehicle Make</option>
            {makeOptions}
          </select>

          <br></br>
          <label id='model-label'>Vehicle Model</label>
          <select
            onChange={(e) => setVehicleModelId(e.target.value)}
            className='form-select'
            autoComplete='model'
            id='model-options'
          >
            <option value=''>Model</option>
            {modelOptions}
          </select>
          <br></br>

          <label>Distance Driven</label>
          <input
            onChange={(e) => setDistance(e.target.value)}
            type='number'
            required
            min='0'
            value={distance}
            step='0.1'
          ></input>
          <label>Unit Select</label>
          <select
            onChange={(e) => setDistanceUnit(e.target.value)}
            className='form-select'
            autoComplete='unit'
            id='unit-options'
          >
            <option value=''>unit</option>
            <option value='km'>Km</option>
            <option value='mi'>Mi</option>
          </select>
          <input type='submit'></input>
        </form>

        <p id='veh-emissions'>
        {typeof showEmissionsVeh === 'object' && showEmissionsVeh !== null ? (
            <>
            Carbon Emissions (lb): {showEmissionsVeh.carbon_lb} <br />
      Carbon Emissions (kg): {showEmissionsVeh.carbon_kg}
      </>
      ) : ('No emissions data available')}
      </p>
      </div>
      <div id='electricity-form'>
        <h1>How much power U B usin?</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmissionType('electricity'); // triggers `useEffect` for electricity submission
          }}
        >
          <label>Country</label>
          <select
            onChange={(e) => countrySelection(e)}
            className='form-select'
            autoComplete='country'
            id='country'
            name='country'
          >
            <option value=''>country</option>
            <option value='US'>United States of America</option>
            <option value='CA'>Canada</option>
            <option value='AT'>Austria</option>
            <option value='BE'>Belgium</option>
            <option value='BG'>Bulgaria</option>
            <option value='HR'>Croatia</option>
            <option value='CY'>Cyprus</option>
            <option value='CZ'>Czechia</option>
            <option value='DK'>Denmark</option>
            <option value='EU-27'>EU-27</option>
            <option value='EU-27+1'>EU-27+1</option>
            <option value='EE'>Estonia</option>
            <option value='FI'>Finland</option>
            <option value='FR'>France</option>
            <option value='DE'>Germany</option>
            <option value='GR'>Greece</option>
            <option value='GU'>Hungary</option>
            <option value='IE'>Ireland</option>
            <option value='IT'>Italy</option>
            <option value='LV'>Latvia</option>
            <option value='LT'>Lithuania</option>
            <option value='LU'>Luxembourg</option>
            <option value='MT'>Malta</option>
            <option value='NL'>Netherlands</option>
            <option value='PL'>Poland</option>
            <option value='PT'>Portugal</option>
            <option value='RO'>Romania</option>
            <option value='SK'>Slovakia</option>
            <option value='SI'>Slovenia</option>
            <option value='ES'>Spain</option>
            <option value='SE'>Sweden</option>
            <option value='GB'>United Kingdom</option>
          </select>
          <br></br>
          <label id='state-label'>State</label>
          <select
            onChange={(e) => stateSelection(e)}
            className='form-select'
            id='state-options'
          >
            <option value=''>State</option>
            <option value='AL'>Alabama</option>
            <option value='AK'>Alaska</option>
            <option value='AZ'>Arizona</option>
            <option value='AR'>Arkansas</option>
            <option value='CA'>California</option>
            <option value='CO'>Colorado</option>
            <option value='CT'>Connecticut</option>
            <option value='DE'>Delaware</option>
            <option value='DC'>District Of Columbia</option>
            <option value='FL'>Florida</option>
            <option value='GA'>Georgia</option>
            <option value='HI'>Hawaii</option>
            <option value='ID'>Idaho</option>
            <option value='IL'>Illinois</option>
            <option value='IN'>Indiana</option>
            <option value='IA'>Iowa</option>
            <option value='KS'>Kansas</option>
            <option value='KY'>Kentucky</option>
            <option value='LA'>Louisiana</option>
            <option value='ME'>Maine</option>
            <option value='MD'>Maryland</option>
            <option value='MA'>Massachusetts</option>
            <option value='MI'>Michigan</option>
            <option value='MN'>Minnesota</option>
            <option value='MS'>Mississippi</option>
            <option value='MO'>Missouri</option>
            <option value='MT'>Montana</option>
            <option value='NE'>Nebraska</option>
            <option value='NV'>Nevada</option>
            <option value='NH'>New Hampshire</option>
            <option value='NJ'>New Jersey</option>
            <option value='NM'>New Mexico</option>
            <option value='NY'>New York</option>
            <option value='NC'>North Carolina</option>
            <option value='ND'>North Dakota</option>
            <option value='OH'>Ohio</option>
            <option value='OK'>Oklahoma</option>
            <option value='OR'>Oregon</option>
            <option value='PA'>Pennsylvania</option>
            <option value='RI'>Rhode Island</option>
            <option value='SC'>South Carolina</option>
            <option value='SD'>South Dakota</option>
            <option value='TN'>Tennessee</option>
            <option value='TX'>Texas</option>
            <option value='UT'>Utah</option>
            <option value='VT'>Vermont</option>
            <option value='VA'>Virginia</option>
            <option value='WA'>Washington</option>
            <option value='WV'>West Virginia</option>
            <option value='WI'>Wisconsin</option>
            <option value='WY'>Wyoming</option>
          </select>
          <br></br>
          <label id='province-label'>Province</label>
          <select onChange={(e) => stateSelection(e)} id='province-options'>
            <option value='AB'>Alberta</option>
            <option value='BC'>British Columbia</option>
            <option value='MB'>Manitoba</option>
            <option value='NB'>New Brunswick</option>
            <option value='NL'>Newfoundland and Labrador</option>
            <option value='NT'>Northwest Territories</option>
            <option value='NS'>Nova Scotia</option>
            <option value='NU'>Nunavut</option>
            <option value='ON'>Ontario</option>
            <option value='PE'>Prince Edward Island</option>
            <option value='QC'>Quebec</option>
            <option value='SK'>Saskatchewan</option>
            <option value='YT'>Yukon</option>
          </select>
          <br></br>
          <label>kwh of electricity used this month</label>
          <input
            onChange={(e) => changeAmount(e)}
            type='number'
            required
            min='0'
            value={powerUsage}
            step='0.01'
          ></input>
          <input type='submit'></input>
        </form>
        
        {/*narrowed types of showEmissionsElec before attempting to access its properties in case it was undefined*/}
        <p id='elec-emissions'>
          {typeof showEmissionsElec === 'object' && showEmissionsElec !== null ? (
            <>
            Carbon Emissions (lb): {showEmissionsElec.carbon_lb} <br />
      Carbon Emissions (kg): {showEmissionsElec.carbon_kg}
            Carbon Emissions (lb): {showEmissionsElec.carbon_lb} <br />
      Carbon Emissions (kg): {showEmissionsElec.carbon_kg}
      </>
      ) : ('No emissions data available')}
      </p>
          
      </div>
      <div id='offset-programs'>
        <h3>Offset Programs</h3>
        <OffsetPrograms /> {/* render offsetProgram component */}
      </div>
    </div>
  );
}

export default ClientForm