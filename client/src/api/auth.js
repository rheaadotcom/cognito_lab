import api from './index';

const BASE_URL = '/auth';

export const signup = async (userData) => {
  const response = await api.post(`${BASE_URL}/signup`, userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post(`${BASE_URL}/login`, credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.get(`${BASE_URL}/logout`);
  return response.data;
};
