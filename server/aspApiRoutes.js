import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.74:5134',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
   
      const { data, status, headers } = error.response;
    
    } else if (error.request) {
  
    } else {
  
    }
    return Promise.reject(error);
  }
);

export default apiClient;
