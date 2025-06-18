import axios from 'axios';
// API istekleri doğrudan Django backend'e gider
const API_BASE_URL = 'http://127.0.0.1:8000/api/devicedocuments/';

// Belirli bir cihaza ait tüm dökümanları getirir
export const getDocumentsForDevice = (deviceId) => {
  // GET /api/devicedocuments/?device={deviceId}
  return axios.get(`${API_BASE_URL}?device=${deviceId}`);
  // Bu fonksiyon, ilgili cihaza ait tüm dökümanları listeler.
};

// Yeni döküman ekler (FormData ile)
export const addDocument = (deviceId, formData) => {
  // POST /api/devicedocuments/ (FormData: file, description, device)
  // formData: { file, description, device }
  return axios.post(API_BASE_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  // Bu fonksiyon, yeni bir döküman yükler.
};

// Dökümanı siler
export const deleteDocument = (documentId) => {
  // DELETE /api/devicedocuments/{id}/
  return axios.delete(`${API_BASE_URL}${documentId}/`);
  // Bu fonksiyon, dökümanı siler.
};

// Kullanım örneği:
// const formData = new FormData();
// formData.append('file', file);
// formData.append('description', 'Kullanım Kılavuzu');
// formData.append('device', deviceId);
// addDocument(deviceId, formData); 