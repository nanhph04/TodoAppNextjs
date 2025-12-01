import axios from 'axios';
import { getAccessToken, setAccessToken } from './tokenService';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (reponse) => reponse,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await axiosClient.post('/auth/refresh');

                const newAccessToken = res.data.accessToken;

                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);

            } catch (refreshError) {
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;