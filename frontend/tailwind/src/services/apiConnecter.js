import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL, // ✅ IMPORTANT
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // optional (cookies / auth)
});

export const apiConnector = (
    method,
    url,
    bodyData = null,
    headers = null,
    params = null
) => {
    return axiosInstance({
        method,
        url,
        data: bodyData,
        headers,
        params,
    });
};
