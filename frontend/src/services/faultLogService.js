import axios from 'axios';
// API istekleri doğrudan Django backend'e gider
const API_BASE_URL = 'http://127.0.0.1:8000/api/devices/';

// Belirli bir cihaza yeni arıza kaydı ekler
export const addFaultLog = (deviceId, logData) => {
    return axios.post(`${API_BASE_URL}${deviceId}/faultlogs/`, logData);
};

// Belirli bir cihazın tüm arıza kayıtlarını getirir
export const getFaultLogsForDevice = (deviceId) => {
    return axios.get(`${API_BASE_URL}${deviceId}/faultlogs/`);
}; 