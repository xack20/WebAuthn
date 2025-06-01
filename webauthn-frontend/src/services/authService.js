// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const register = async (username, displayName) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('display', displayName);
  
  const response = await axios.post(`${API_URL}/auth/register`, formData, {
    withCredentials: true
  });
  
  return response.data;
};

export const finishRegistration = async (credential, username, credname) => {
  const response = await axios.post(`${API_URL}/auth/finishRegistration`, {
    credential: JSON.stringify(credential),
    username,
    credname
  }, {
    withCredentials: true
  });
  
  return response.data;
};

export const login = async (username) => {
  const formData = new FormData();
  formData.append('username', username);
  
  const response = await axios.post(`${API_URL}/auth/login`, formData, {
    withCredentials: true
  });
  
  return response.data;
};

export const finishLogin = async (credential, username) => {
  const response = await axios.post(`${API_URL}/auth/finishLogin`, {
    credential: JSON.stringify(credential),
    username
  }, {
    withCredentials: true
  });
  
  return response.data;
};
