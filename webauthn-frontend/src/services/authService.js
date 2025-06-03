import axios from 'axios';

// Update API URL for new backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Registration flow for new backend
export const startRegistration = async (username, displayName) => {
  try {
    console.log('Starting registration for:', { username, displayName });
    
    const response = await api.get(`/webauthn/register/options`, {
      params: { username, displayName }
    });
    
    console.log('Registration options response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error starting registration:', error);
    throw error;
  }
};

export const finishRegistration = async (username, attestationResponse) => {
  try {
    console.log('Finishing registration for:', username);
    console.log('Attestation response:', attestationResponse);
    
    const response = await api.post(`/webauthn/register/complete`, 
      attestationResponse,
      { 
        params: { username },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Registration completion response:', response.data);
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error('Error finishing registration:', error);
    throw error;
  }
};

// Login flow for new backend
export const startLogin = async (username) => {
  try {
    console.log('Starting login for:', username);
    
    const response = await api.get(`/webauthn/authenticate/options`, {
      params: { username }
    });
    
    console.log('Authentication options response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error starting login:', error);
    throw error;
  }
};

export const finishLogin = async (username, assertionResponse) => {
  try {
    console.log('Finishing login for:', username);
    console.log('Assertion response:', assertionResponse);
    
    const response = await api.post(`/webauthn/authenticate/complete`,
      assertionResponse,
      { 
        params: { username },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Authentication completion response:', response.data);
    return { status: 'success', data: response.data };
  } catch (error) {
    console.error('Error finishing login:', error);
    throw error;
  }
};

// Check if user exists
export const checkUserExists = async (username) => {
  try {
    await api.get(`/webauthn/authenticate/options`, {
      params: { username }
    });
    return { exists: true };
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 400) {
      return { exists: false };
    }
    throw error;
  }
};
