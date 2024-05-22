// import axios from 'axios';

// const baseURL = 'http://localhost:3000'; // Replace this with your actual API URL

// const api = axios.create({
//   baseURL,
//   timeout: 5000, // Adjust the timeout as needed
// });

// export const getShifts = async () => {
//   try {
//     const response = await api.get('/api/shifts');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching shifts:', error);
//     throw error;
//   }
// };

// export const createShift = async (shiftData) => {
//   try {
//     const response = await api.post('/api/shifts', shiftData);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating shift:', error);
//     throw error;
//   }
// };

// // Add more utility functions for other CRUD operations as needed
