
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL, // http://localhost:5000/api/v1
    timeout: 30000,
    withCredentials: false, // true ONLY if cookies used
});

// ✅ Attach token automatically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const apiConnector = async (method, endpoint, bodyData = null, headers = {}) => {
    const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    const config = {
        method,
        url,
        headers: { ...headers },
        data: bodyData,
    };

    return axiosInstance(config); // 🔥 return full axios response
};
