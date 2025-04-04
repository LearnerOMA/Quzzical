// src/axiosInstance.js
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000";
const token = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Authorization': token ? `Bearer ${token}` : '',
    },
});

// Request Interceptor: Automatically attach token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiry
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or unauthorized
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
