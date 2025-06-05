import axios from 'axios';

// ✅ Create the axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/',
    withCredentials: true,  // For cookies, if using sessions
});

// ✅ Automatically add token to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');  // Retrieve token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;  // Add token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export { axiosInstance };
