import axios from 'axios';
// API istekleri doğrudan Django backend'e gider
const API_URL = 'http://127.0.0.1:8000/api/devices/';

export const getDevice = (deviceId) => axios.get(`${API_URL}${deviceId}/`);

export const updateDevice = (deviceId, data) => {
  const headers = {};
  if (data instanceof FormData) headers['Content-Type'] = 'multipart/form-data';
  return axios.put(`${API_URL}${deviceId}/`, data, { headers });
}; 