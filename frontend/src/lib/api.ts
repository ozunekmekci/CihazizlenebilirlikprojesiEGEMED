// Bu dosya, tüm API istekleri için merkezi bir Axios örneği tanımlar.
// Neden: Frontend'deki tüm API çağrılarının tek bir yerden yönetilmesini ve backend URL'sinin sabit olmasını sağlamak.
// Sonuç: `AxiosError: Request failed with status code 404` hatasının önüne geçmek.

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api; 