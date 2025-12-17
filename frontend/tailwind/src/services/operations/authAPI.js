import { apiConnector } from "../apiConnecter";
import { authEndpoints } from "../apis";
import { setToken } from "../../slice/AuthSlice";
import { setUser } from "../../slice/profileSlice";

const {
    SEND_OTP,
    VERIFY_OTP,
    SIGNUP,
    LOGIN,
    RESET_PASSWORD_TOKEN,
    RESET_PASSWORD,
} = authEndpoints;

// LOGIN
export const login = (email, password, role, navigate) => {
    return async (dispatch) => {
        try {
            const res = await apiConnector("POST", LOGIN, {
                email,
                password,
                role,
            });

            const token = res.data.token;
            const user = res.data.user;

            // 🔥 SAVE TO REDUX
            dispatch(setToken(token));
            dispatch(setUser(user));

            // 🔥 SAVE TO LOCAL STORAGE
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };
};

// SEND OTP
export const sendOtp = async (email) => {
    if (!email) throw new Error("Email is required");
    return await apiConnector("POST", SEND_OTP, { email });
};

// VERIFY OTP
export const verifyOtp = async (email, otp) => {
    if (!email || !otp) throw new Error("Email and OTP are required");
    return await apiConnector("POST", VERIFY_OTP, { email, otp });
};

// SIGNUP
export const signup = async (data) => {
    return await apiConnector("POST", SIGNUP, data);
};


// RESET PASSWORD TOKEN
export const getPasswordResetToken = (email, setEmailSent) => {
    return async () => {
        try {
            const res = await apiConnector(
                "POST",
                RESET_PASSWORD_TOKEN,
                { email }
            );

            if (res.data.success) {
                setEmailSent(true);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Reset link failed");
        }
    };
};

// RESET PASSWORD
export const resetPassword = (password, confirmPassword, token, navigate) => {
    return async () => {
        try {
            await apiConnector("POST", RESET_PASSWORD, {
                password,
                confirmPassword,
                token,
            });
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Reset failed");
        }
    };
};


export const logoutUser = async () => {
    return apiConnector("POST", "/auth/logout");
};
