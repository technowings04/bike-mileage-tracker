import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Fuel Records
export const getAllFuelRecords = () => api.get('/fuel');
export const getStats = () => api.get('/fuel/stats');
export const addFuelRecord = (data) => api.post('/fuel', data);
export const deleteFuelRecord = (id) => api.delete(`/fuel/${id}`);
export const updateFuelRecord = (id, data) => api.put(`/fuel/${id}`, data);

// Petrol Prices
export const getLatestPrice = () => api.get('/price/latest');
export const getPriceHistory = () => api.get('/price');
export const addPetrolPrice = (data) => api.post('/price', data);

export default api;