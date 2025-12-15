import { apiConnector } from "./apiConnecter";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const categories = {
    CATEGORY_API: `${BASE_URL}/category/all`,
};

// AUTH APIs

export const sendOtp = (email) => {
    return apiConnector("POST", "/auth/send-otp", { email });
};

export const verifyOtp = (email, otp) => {
    return apiConnector("POST", "/auth/verify-otp", { email, otp });
};

export const signup = (data) => {
    return apiConnector("POST", "/auth/signup", data);
};
