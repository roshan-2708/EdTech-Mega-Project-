import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "../services/operations/authAPI";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const inputsRef = useRef([]);

    // SEND OTP
    const handleSendOtp = async () => {
        if (!email) return alert("Please enter email");

        try {
            setLoading(true);
            const res = await sendOtp(email);
            if (res.data.success) {
                setOtpSent(true);
                alert("OTP sent to your email");
            } else {
                alert(res.data.message || "Failed to send OTP");
            }
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };


    // VERIFY OTP
    const handleVerifyOtp = async () => {
        const finalOtp = otp.join("");
        if (finalOtp.length < 6) {
            alert("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            const res = await verifyOtp(email, finalOtp);
            if (res.data.success) {
                localStorage.setItem("verifiedEmail", email);
                navigate("/signup");
            } else {
                alert(res.data.message || "Invalid OTP");
            }
        } catch (err) {
            alert(err?.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // OTP input handler
    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) inputsRef.current[index + 1].focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-richblack-900 text-white">
            <div className="w-11/12 max-w-md bg-richblack-800 rounded-xl p-8 shadow-lg">

                <h1 className="text-3xl font-bold mb-2">Verify Email</h1>
                <p className="text-richblack-300 mb-6">Enter your email to receive a verification code</p>

                {/* EMAIL INPUT */}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    placeholder="Enter your email"
                    className={`w-full p-2 rounded-lg mb-4 border 
                        ${otpSent
                            ? "bg-richblack-700 cursor-not-allowed opacity-60"
                            : "bg-richblack-900 border-richblack-600"
                        }`}
                />

                {/* SEND OTP BUTTON */}
                {!otpSent && (
                    <button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="w-full bg-yellow-50 text-black py-2 rounded-md font-semibold hover:scale-95 transition"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                )}

                {/* OTP INPUTS */}
                {otpSent && (
                    <>
                        <p className="text-sm text-richblack-300 mt-4 mb-2">Enter the 6-digit OTP</p>
                        <div className="flex justify-between mb-5">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-11 h-11 text-center text-xl font-bold 
                                        bg-richblack-900 border border-richblack-600 
                                        rounded-lg focus:outline-none focus:border-yellow-50"
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full bg-yellow-50 text-black py-2 rounded-md font-semibold hover:scale-95 transition"
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
