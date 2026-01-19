

import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 30000,
    withCredentials: true, // ✅ REQUIRED
});

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
