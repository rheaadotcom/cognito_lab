import api from './index';

const BASE_URL = '/responses';

export const getExperimentResponses = async (experimentId) => {
  const response = await api.get(`${BASE_URL}/experiment/${experimentId}`);
  return response.data;
};

export const submitResponse = async (responseData) => {
  const response = await api.post(BASE_URL, responseData);
  return response.data;
};
