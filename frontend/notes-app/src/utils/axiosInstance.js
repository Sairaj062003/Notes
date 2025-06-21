import axios from 'axios';
import { BASE_URL } from './constants';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token'); // Fixed string key
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle HTTP errors
            if (error.response.status === 401) {
                // Handle unauthorized access
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject({ message: "No response from server" });
        } else {
            // Something happened in setting up the request
            return Promise.reject({ message: error.message });
        }
    }
);

export default axiosInstance;