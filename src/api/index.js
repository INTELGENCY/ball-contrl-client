import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signUp = async (formData) => {
  try {
    const response = await api.post(`auth/signup`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};