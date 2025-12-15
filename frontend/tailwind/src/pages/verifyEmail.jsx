import React, { useState } from "react";
import { sendOtp, verifyOtp } from "../services/apis";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    // SEND OTP
    const handleSendOtp = async () => {
        try {
            setLoading(true);
            await sendOtp(email);
            setOtpSent(true);
            alert("OTP sent to email");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // VERIFY OTP
    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            await verifyOtp(email, otp);

            // Save verified email
            localStorage.setItem("verifiedEmail", email);

            navigate("/signup");
        } catch (err) {
            alert(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4 text-center">
                    Verify Email
                </h2>

                {/* EMAIL INPUT */}
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                />

                {!otpSent ? (
                    <button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                ) : (
                    <>
                        {/* OTP INPUT */}
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border p-2 rounded my-3"
                        />

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
