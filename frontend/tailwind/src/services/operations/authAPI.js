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

            navigate("/dashboard/profile");
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
// RESET PASSWORD
export const resetPassword = (password, confirmPassword, token) => {
    return async () => {
        try {
            await apiConnector("POST", RESET_PASSWORD, {
                password,
                confirmPassword,
                token,
            });
            // ✅ SUCCESS TOAST
            toast.success("Password updated successfully 🎉");
        } catch (err) {
            alert(err.response?.data?.message || "Reset failed");
        }
    };
};



// ! Logout

export const logoutUser = (navigate) => {
    return async (dispatch) => {
        try {
            await apiConnector("POST", "/auth/logout");

            localStorage.removeItem("token");
            dispatch(setUser(null));

            navigate("/login");
        } catch (error) {
            console.error("LOGOUT ERROR:", error);
        }
    };
};
