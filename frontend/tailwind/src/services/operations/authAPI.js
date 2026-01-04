// import { apiConnector } from "../apiConnecter";
// import { authEndpoints } from "../apis";
// import { setToken } from "../../slice/AuthSlice";
// import { setUser } from "../../slice/profileSlice";
// import toast from "react-hot-toast";
// const {
//     SEND_OTP,
//     VERIFY_OTP,
//     SIGNUP,
//     LOGIN,
//     RESET_PASSWORD_TOKEN,
//     RESET_PASSWORD,
// } = authEndpoints;

// // LOGIN
// export const login = (email, password, role, navigate) => {
//     return async (dispatch) => {
//         try {
//             const res = await apiConnector("POST", LOGIN, {
//                 email,
//                 password,
//                 role,
//             });

//             const token = res.data.token;
//             const user = res.data.user;

//             // 🔥 SAVE TO REDUX
//             dispatch(setToken(token));
//             dispatch(setUser(user));

//             // 🔥 SAVE TO LOCAL STORAGE
//             localStorage.setItem("token", token);
//             localStorage.setItem("user", JSON.stringify(user));

//             navigate("/dashboard/my-profile");
//         } catch (err) {
//             alert(err.response?.data?.message || "Login failed");
//         }
//     };
// };

// // SEND OTP
// export const sendOtp = async (email) => {
//     if (!email) throw new Error("Email is required");
//     return await apiConnector("POST", SEND_OTP, { email });
// };

// // VERIFY OTP
// export const verifyOtp = async (email, otp) => {
//     if (!email || !otp) throw new Error("Email and OTP are required");
//     return await apiConnector("POST", VERIFY_OTP, { email, otp });
// };

// // SIGNUP
// export const signup = async (data) => {
//     return await apiConnector("POST", SIGNUP, data);
// };


// // RESET PASSWORD TOKEN
// export const getPasswordResetToken = (email, setEmailSent) => {
//     return async () => {
//         try {
//             const res = await apiConnector(
//                 "POST",
//                 RESET_PASSWORD_TOKEN,
//                 { email }
//             );
//             if (res.data.success) {
//                 setEmailSent(true);
//             }
//         } catch (err) {
//             alert(err.response?.data?.message || "Reset link failed");
//         }
//     };
// };

// // RESET PASSWORD
// export const resetPassword = (password, confirmPassword, token) => {
//     return async () => {
//         try {
//             await apiConnector("POST", RESET_PASSWORD, {
//                 password,
//                 confirmPassword,
//                 token,
//             });
//             // ✅ SUCCESS TOAST
//             toast.success("Password updated successfully 🎉");
//         } catch (err) {
//             alert(err.response?.data?.message || "Reset failed");
//         }
//     };
// };

// // ! Logout

// export const logoutUser = (navigate) => {
//     return async (dispatch) => {
//         try {
//             await apiConnector("POST", "/auth/logout");

//             localStorage.removeItem("token");
//             dispatch(setUser(null));

//             navigate("/login");
//         } catch (error) {
//             console.error("LOGOUT ERROR:", error);
//         }
//     };
// };


// // change password

// export const changePassword = async (token, oldPassword, newPassword) => {
//     const response = await fetch(
//         "http://localhost:5000/api/v1/auth/change-password",
//         {
//             method: "PUT",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({ oldPassword, newPassword }),
//         }
//     )
//     return response.json()
// }

// // delete account

// export const deleteAccount = async (token) => {
//     const response = await fetch(
//         "http://localhost:5000/api/v1/auth/delete-account",
//         {
//             method: "DELETE",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         }
//     );

//     return response.json();
// };

// src/services/operations/authAPI.js

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
            const res = await apiConnector("POST", LOGIN, {
                email,
                password,
                role,
            });

            const { token, user } = res.data;

            dispatch(setToken(token));
            dispatch(setUser(user));

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/dashboard/my-profile");
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
