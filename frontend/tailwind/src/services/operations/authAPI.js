
import { apiConnector } from "../apiConnecter";
import { authEndpoints } from "../apis";
import { setToken } from "../../slice/AuthSlice";
import { setUser } from "../../slice/profileSlice";
import toast from "react-hot-toast";

const {
    SEND_OTP,
    VERIFY_OTP,
    SIGNUP,
    LOGIN,
    LOGOUT,
    CHANGE_PASSWORD,
    DELETE_ACCOUNT,
    RESET_PASSWORD_TOKEN,
    RESET_PASSWORD,
} = authEndpoints;

// ================= LOGIN =================
export const login = (email, password, role, navigate) => {
    return async (dispatch) => {
        try {
            const res = await apiConnector("POST", LOGIN, { email, password, role });

            const { token, user } = res.data?.data || res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            dispatch(setToken(token));
            dispatch(setUser(user));

            toast.success("Login successful 🎉");

            if (role === "Instructor") {
                navigate("/dashboard/my-profile");
            } else if (role === "Student") {
                navigate("/dashboard/my-profile");
            } else {
                navigate("/");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    };
};


// ================= SEND OTP =================
export const sendOtp = (email) => {
    return apiConnector("POST", SEND_OTP, { email });
};

// ================= VERIFY OTP =================
export const verifyOtp = (email, otp) => {
    return apiConnector("POST", VERIFY_OTP, { email, otp });
};

// ================= SIGNUP =================
export const signup = (data) => {
    return apiConnector("POST", SIGNUP, data);
};

// ================= LOGOUT =================
export const logoutUser = (navigate) => {
    return async (dispatch) => {
        try {
            await apiConnector("POST", LOGOUT);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            dispatch(setUser(null));
            dispatch(setToken(null));

            navigate("/login");
        } catch (error) {
            console.error("LOGOUT ERROR:", error);
        }
    };
};

// ================= CHANGE PASSWORD =================
export const changePassword = (oldPassword, newPassword) => {
    return apiConnector("PUT", CHANGE_PASSWORD, {
        oldPassword,
        newPassword,
    });
};

// ================= DELETE ACCOUNT =================
export const deleteAccount = () => {
    return apiConnector("DELETE", DELETE_ACCOUNT);
};
// ================= SEND RESET PASSWORD LINK =================
export const getPasswordResetToken = (email, setEmailSent) => {
    return async () => {
        try {
            const res = await apiConnector("POST", RESET_PASSWORD_TOKEN, { email });

            if (res.data.success) {
                setEmailSent(true);
                toast.success("Reset link sent to your email 📧");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send reset link");
        }
    };
};

// ================= RESET PASSWORD =================
export const resetPassword = (password, confirmPassword, token, navigate) => {
    return async () => {
        try {
            const res = await apiConnector("POST", RESET_PASSWORD, {
                password,
                confirmPassword,
                token,
            });

            if (res.data.success) {
                toast.success("Password reset successful 🎉");
                navigate("/login");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Password reset failed");
        }
    };
};
