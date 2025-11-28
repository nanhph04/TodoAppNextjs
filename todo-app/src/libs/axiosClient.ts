import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

let accessToken = '';

export function setAccessToken(token: string) {
    accessToken = token;
}

axiosClient.interceptors.request.use(
    (config) => {
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