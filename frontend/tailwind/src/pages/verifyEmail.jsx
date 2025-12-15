import React, { useRef, useState } from "react";
import { sendOtp, verifyOtp } from "../services/apis";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputsRef = useRef([]);

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
            const finalOtp = otp.join("");
            await verifyOtp(email, finalOtp);

            localStorage.setItem("verifiedEmail", email);
            navigate("/signup");
        } catch (err) {
            alert(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // OTP CHANGE
    const handleOtpChange = (e, index) => {
        const value = e.target.value;

        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-richblack-900 text-white p-6 rounded shadow-md w-96">
                <h2 className="text-3xl font-bold mb-4 text-left">
                    Verify Email
                </h2>

                <p className="text-sm mb-5 text-richblack-300">
                    A verification code has been sent to your email.
                </p>

                {/* EMAIL INPUT */}
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    className={`w-full border-2 p-2 rounded mb-3
        ${otpSent
                            ? "bg-gray-700 cursor-not-allowed opacity-60"
                            : "border-yellow-50 bg-richblack-800"}
    `}
                />


                {!otpSent ? (
                    <button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full bg-yellow-50 text-black py-2 rounded font-semibold"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                ) : (
                    <>
                        {/* OTP BOXES */}
                        <div className="flex justify-between my-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 text-center text-xl font-bold 
                                            border border-richblack-500 rounded-lg 
                                        bg-richblack-800 text-white 
                                        focus:outline-none focus:border-yellow-50"
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded font-semibold"
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
