export const authEndpoints = {
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    RESET_PASSWORD_TOKEN: "/auth/reset-password-token",
    RESET_PASSWORD: "/auth/reset-password",
    CATEGORY_API: "/category/all",
    PROFILE_IMAGE: "/profile/update-display-picture",
    PROFILE_UPDATE : "/profile/update-profile"
};

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const categories = {
    CATEGORY_API: `${BASE_URL}/category/all`,
};
export const contactEndpoints = {
    CONTACT_US: "/contact", // adjust if backend path differs
};
