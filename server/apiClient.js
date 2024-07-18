import axios from 'axios';
 
// Create an instance of Axios with the base URL for your ASP.NET Core Web API
const apiClient = axios.create({
  baseURL: 'https://localhost:7049/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});
 
// Add a request interceptor to include the JWT token in the headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;