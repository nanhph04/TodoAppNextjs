import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Tạo instance
const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Quan trọng để gửi Cookie (Refresh Token)
});

// --- Request Interceptor ---
axiosClient.interceptors.request.use(
    (config) => {
        // Luôn lấy token mới nhất từ LocalStorage ngay trước khi gửi request
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Logic xử lý Concurrency (Hàng đợi) ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// --- Response Interceptor ---
axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Nếu lỗi 401 và chưa từng retry
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Nếu đang có một tiến trình refresh chạy rồi, thì request này xếp hàng đợi
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/auth/refresh`,
                    {},
                    { withCredentials: true } // Gửi cookie refresh token
                );

                const { accessToken } = res.data;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', accessToken);
                    // Bắn event để AuthContext cập nhật state React
                    window.dispatchEvent(new Event('authTokenRefreshed'));
                }

                // Cập nhật token cho request hiện tại
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                // Xử lý xong, giải phóng hàng đợi các request đang chờ
                processQueue(null, accessToken);

                return axiosClient(originalRequest);

            } catch (refreshError) {
                // Nếu refresh thất bại (hết hạn session thực sự)
                processQueue(refreshError, null);

                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    // localStorage.removeItem('userId');
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;