import axios from 'axios';
// API istekleri doğrudan Django backend'e gider
const API_BASE_URL = 'http://127.0.0.1:8000/api/devices/';

// Belirli bir cihaza yeni kalibrasyon kaydı ekler
export const addCalibrationLog = (deviceId, logData) => {
    return axios.post(`${API_BASE_URL}${deviceId}/calibrationlogs/`, logData);
};

// Belirli bir cihazın tüm kalibrasyon kayıtlarını getirir
export const getCalibrationLogsForDevice = (deviceId) => {
    return axios.get(`${API_BASE_URL}${deviceId}/calibrationlogs/`);
}; 