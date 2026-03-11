import api from './index';

const BASE_URL = '/experiments';

export const getExperiments = async () => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const getExperiment = async (id) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createExperiment = async (experimentData) => {
  const response = await api.post(BASE_URL, experimentData);
  return response.data;
};

export const deleteExperiment = async (id) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
};

// Placeholder for stats if we implement it on backend
export const getStats = async () => {
  // For now, we'll calculate stats from the experiments list if needed
  const response = await api.get(BASE_URL);
  const experiments = response.data.data;
  
  return {
    success: true,
    data: {
      totalExperiments: experiments.length,
      activeExperiments: experiments.filter(e => e.status === 'active').length,
      totalParticipants: experiments.reduce((acc, e) => acc + (e.participantCount || 0), 0)
    }
  };
};
export const updateExperiment = async (id, updateData) => {
  const response = await api.patch(`${BASE_URL}/${id}`, updateData);
  return response.data;
};
