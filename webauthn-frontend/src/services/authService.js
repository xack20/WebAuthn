// src/services/authService.js
import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // If running locally (localhost), use local API
  if (window.location.hostname === 'localhost') {
    return process.env.REACT_APP_LOCAL_API_URL || 'http://localhost:8080/api';
  }
  // Otherwise use the production/ngrok API URL
  return process.env.REACT_APP_API_URL || 'https://presently-amusing-marten.ngrok-free.app/api';
};

const API_URL = getApiUrl();

console.log('Using API URL:', API_URL); // For debugging

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
