import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(getPasswordResetToken(email, setEmailSent));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-richblack-900 px-4">
            <div className="w-full max-w-md bg-richblack-800 rounded-xl p-6 shadow-lg">

                {/* HEADING */}
                <h1 className="text-2xl font-bold text-richblack-5 mb-2 text-center">
                    {!emailSent ? "Reset Your Password" : "Check Your Email"}
                </h1>

                <p className="text-sm text-richblack-300 text-center mb-6">
                    {!emailSent ? (
                        <>
                            Have no fear. We’ll email you instructions to reset your
                            password. If you don’t have access to your email, we can
                            try account recovery.
                        </>
                    ) : (
                        <>
                            We have sent the reset email to
                            <span className="text-yellow-50 font-medium">
                                {" "}{email}
                            </span>
                        </>
                    )}
                </p>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!emailSent && (
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm text-richblack-200 mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-3 py-2 rounded-md 
                                            bg-richblack-700 text-richblack-5 
                                            outline-none border border-richblack-600 
                                            focus:border-yellow-50"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-yellow-50 text-black 
                                    font-semibold py-2 rounded-md 
                                    hover:scale-95 transition-all"
                        
                    >
                        {!emailSent ? "Reset Password" : "Resend Email"}
                    </button>
                </form>

                {/* BACK TO LOGIN */}
                <div className="mt-4 text-center">
                    <Link
                        to="/login"
                        className="text-sm text-richblack-300 
                                    hover:text-richblack-5 hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
