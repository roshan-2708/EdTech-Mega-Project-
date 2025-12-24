import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
});

export const apiConnector = (
    method,
    url,
    bodyData = null,
    headers = {},
    params = null
) => {
    return axiosInstance({
        method,
        url,
        data: bodyData,
        params,
        headers: {
            ...headers, // 🔥 merge headers correctly
        },
    });
};
