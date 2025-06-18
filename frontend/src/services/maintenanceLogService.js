import axios from 'axios';
// API istekleri doğrudan Django backend'e gider
const API_BASE_URL = 'http://127.0.0.1:8000/api/devices/';

export const addMaintenanceLog = (deviceId, logData) => {
    return axios.post(`${API_BASE_URL}${deviceId}/maintenancelogs/`, logData);
};

export const getMaintenanceLogsForDevice = (deviceId) => {
    return axios.get(`${API_BASE_URL}${deviceId}/maintenancelogs/`);
}; 