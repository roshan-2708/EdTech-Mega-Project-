import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 30000,
    withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR (AUTO ADD TOKEN)
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

export const apiConnector = async (
    method,
    endpoint,
    bodyData = null,
    headers = {}
) => {
    const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    return axiosInstance({
        method,
        url,
        data: bodyData,
        headers,
    });
};
