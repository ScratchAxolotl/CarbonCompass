import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

export default function ClientForm() {
  const [emissionType, setEmissionType] = useState('');
  const [makes, setMakes] = useState('');
  const [models, setModels] = useState('');
  const [powerUsage, setPowerUsage] = useState(0);
  const [country, setCountry] = useState('');
  const [subregion, setSubregion] = useState('');

  function selectEmissionType(){
    setEmissionType(e.target.value)
  }
  function getModels(){
    
  }
  function changeAmount(e){
    setPowerUsage(e.target.value);
    console.log('amount',powerUsage);
  }
  function countrySelection(e){
    setCountry(e.target.value);
    console.log("country:",e.target.value);
  }
  function stateSelection(e){
    setSubregion(e.target.value);
    console.log("subregion:",subregion);
  }
  function subRegionsVis(){

    if(country === 'US'){
        document.getElementById("state-options").style.visibility = 'visible';
        document.getElementById("state-label").style.visibility = 'visible';
        document.getElementById("province-label").style.visibility = 'hidden';
        document.getElementById("province-options").style.visibility = 'hidden';
    }else if(country === 'CA'){
        document.getElementById("province-options").style.visibility = 'visible';
        document.getElementById("province-label").style.visibility = 'visible';
        document.getElementById("state-label").style.visibility = 'hidden';
        document.getElementById("state-options").style.visibility = 'hidden';
    }else{
        document.getElementById("province-label").style.visibility = 'hidden';
        document.getElementById("state-label").style.visibility = 'hidden';
        document.getElementById("province-options").style.visibility = 'hidden';
        document.getElementById("state-options").style.visibility = 'hidden';
    }
  };
  async function submitForm(e){
    e.preventDefault();
    const url = '/api/electricity';
    const request = {
        method: 'POST',
        body: JSON.stringify({
          type: 'electricity',
          country: country,
          state: subregion,
          electricity_unit: 'kwh',
          electricity_value: powerUsage,
         }),
        headers: {
            "Content-Type": "application/json",
        },
      }
    try{
        console.log('req:',request)
      const response = await fetch(url, request);
      if(!response.ok){
        throw new Error(`Response status: ${response.status}`);
      }

      const json = (await response).json();
      console.log('res:',json)

    }catch(err){
      console.log(err.message);
    }
  }

  useEffect(()=>{
    //sum stuff :^)
    subRegionsVis()
  });

  return (
    <div>
    <div id='vehicle-form'>
      <h1>How far U drive?</h1>
      <form onSubmit={(e)=>submitForm(e)}>
        <label>Select Vehicle Make</label>
        <select onChange={} className="form-select" autoComplete="vehicle" id="make-options">
          <option value="">Vehicle Make</option>
          </select>
            <br></br>
        <label id="model-label">State</label>
        <select onChange={} className="form-select" autioComplete='model' id="model-options">
          <option value="">Model</option>
          
        </select>
            <br></br>
        
        <label>Distance Driven</label>
        <input onChange={(e)=>changeAmount(e)} type='number' required min="0" value={powerUsage} step="0.01"></input>
        <input type='submit'></input>
        <label>Unit Select</label>
        <select onChange={} className="form-select" autoComplete="unit" id="unit-options">
          <option value="">Vehicle Make</option>
          {

          }
          </select>
        <input type='submit'></input>
      </form>
    </div>
    <div id='electricity-form'>
      <h1>How much power U B usin?</h1>
      <form onSubmit={(e)=>submitForm(e)}>
        <label>Country</label>
        <select onChange={(e)=>countrySelection(e)} className="form-select" autoComplete="country" id="country" name="country">
          <option value="">country</option>
          <option value="US">United States of America</option>
          <option value="CA">Canada</option>
          <option value="AT">Austria</option>
          <option value="BE">Belgium</option>
          <option value="BG">Bulgaria</option>
          <option value="HR">Croatia</option>
          <option value="CY">Cyprus</option>
          <option value="CZ">Czechia</option>
          <option value="DK">Denmark</option>
          <option value="EU-27">EU-27</option>
          <option value="EU-27+1">EU-27+1</option>
          <option value="EE">Estonia</option>
          <option value="FI">Finland</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
          <option value="GR">Greece</option>
          <option value="GU">Hungary</option>
          <option value="IE">Ireland</option>
          <option value="IT">Italy</option>
          <option value="LV">Latvia</option>
          <option value="LT">Lithuania</option>
          <option value="LU">Luxembourg</option>
          <option value="MT">Malta</option>
          <option value="NL">Netherlands</option>
          <option value="PL">Poland</option>
          <option value="PT">Portugal</option>
          <option value="RO">Romania</option>
          <option value="SK">Slovakia</option>
          <option value="SI">Slovenia</option>
          <option value="ES">Spain</option>
          <option value="SE">Sweden</option>
          <option value="GB">United Kingdom</option>
          </select>
            <br></br>
        <label id="state-label">State</label>
        <select onChange={(e)=>stateSelection(e)} className="form-select" id="state-options">
          <option value="">State</option>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">District Of Columbia</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
        </select>
            <br></br>
        <label id="province-label">Province</label>
        <select onChange={(e)=>stateSelection(e)} id="province-options">
          <option value="AB">Alberta</option>
          <option value="BC">British Columbia</option>
          <option value="MB">Manitoba</option>
          <option value="NB">New Brunswick</option>
          <option value="NL">Newfoundland and Labrador</option>
          <option value="NT">Northwest Territories</option>
          <option value="NS">Nova Scotia</option>
          <option value="NU">Nunavut</option>
          <option value="ON">Ontario</option>
          <option value="PE">Prince Edward Island</option>
          <option value="QC">Quebec</option>
          <option value="SK">Saskatchewan</option>
          <option value="YT">Yukon</option>
        </select>
            <br></br>
        <label>kwh of electricity used this month</label>
        <input onChange={(e)=>changeAmount(e)} type='number' required min="0" value={powerUsage} step="0.01"></input>
        <input type='submit'></input>
      </form>
    </div>
    </div>
  )
}
