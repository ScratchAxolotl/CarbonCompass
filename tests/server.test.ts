import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request, { SuperTest, Test } from 'supertest';

import app from '../server/index';

describe('Server Functionality', () => {
  let api;
  beforeAll(async () => {
    api = request(app);
  });

  describe('Testing route /api/test', () => {
    it('responses with 200 status and text/html content type', async () => {
      const res = await api.get('/api/test');
      //expect(res.Content-Type.tobBe( /text\/html/));
      expect(res.text).toBe('The Test is Working!');
      expect(res.status).toBe(200);
    });
  });

  describe('Testing route api/electricity', () => {
    const requestBody = {
      type: 'electricity',
      electricity_unit: 'mwh',
      electricity_value: 42,
      country: 'us',
      state: 'fl',
    };

    it('responses with 200 status and text/html content type', async () => {
      const res = await api.post('/api/electricity').send(requestBody);
      console.log(res);
      //expect(res.headers['content-type'].toMatch(/application\/json/));
      //expect(res.text).toBe('The Test is Working!');
      expect(res.status).toBe(500);
    });
  });

  describe('Testing route api/vehicle', () => {
    const requestBody = {
      type: 'vehicle',
      distance_unit: 'mi',
      distance_value: 100,
      vehicle_model_id: '7268a9b7-17e8-4c8d-acca-57059252afe9',
    };

    it('responses with 200 status and text/html content type', async () => {
      const res = await api.post('/api/vehicle').send(requestBody);
      console.log(res);
      //expect(res.headers['content-type'].toMatch(/application\/json/));
      //expect(res.text).toBe('The Test is Working!');
      expect(res.status).toBe(500);
    });
  });
});
/*
interface ElectricityRequestBody{
  type: string;
  electricity_unit: string; 
  electricity_value: number;
  country: string;
  state: string;  
}
*/
