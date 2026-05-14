import React, { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendOtp, verifyOtp } from "../services/operations/authAPI";
import { BiArrowBack, BiCheckShield } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { BookOpen, Loader2, Users, Award } from "lucide-react";

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    const inputsRef = useRef([]);

    // Countdown Logic
    useEffect(() => {
        let interval;
        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const handleSendOtp = async () => {
        if (!email) return;
        try {
            setLoading(true);
            const res = await sendOtp(email);
            if (res.data.success) {
                setOtpSent(true);
                setTimer(60); // Reset timer on resend
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        const finalOtp = otp.join("");
        if (finalOtp.length < 6) return;

        try {
            setLoading(true);
            const res = await verifyOtp(email, finalOtp);
            if (res.data.success) {
                localStorage.setItem("verifiedEmail", email);
                navigate("/signup");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
        <div className="min-h-screen w-full flex bg-[#000814]">
            {/* LEFT SIDE: Branding & Ed-Tech Content */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-richblack-900 to-[#00122e] p-12 flex-col justify-between relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-yellow-50 text-2xl font-bold mb-12">
                        <div className="bg-yellow-50 text-richblack-900 p-1.5 rounded-lg">
                            <BookOpen size={24} />
                        </div>
                        StudyNotion
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Start your learning <br />
                            <span className="text-blue-100">journey with us.</span>
                        </h2>

                        <div className="space-y-6">
                            {[
                                { icon: Users, title: "Expert Instruction", desc: "Learn from industry experts with real-world experience." },
                                { icon: Award, title: "Global Certification", desc: "Earn certificates recognized by top companies worldwide." },
                                { icon: BiCheckShield, title: "Secure Learning", desc: "Verified accounts ensure a safe environment for everyone." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="p-3 bg-white/5 rounded-xl text-blue-100 group-hover:bg-blue-600/20 transition-all">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-richblack-5 font-semibold">{item.title}</h4>
                                        <p className="text-richblack-400 text-sm max-w-xs">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-richblack-500 text-sm">
                    © 2026 StudyNotion Ed-Tech Inc. All Rights Reserved.
                </div>
            </div>

            {/* RIGHT SIDE: Verification Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
                {/* Mobile Logo Only */}
                <div className="lg:hidden absolute top-8 left-8 text-yellow-50 font-bold text-xl flex items-center gap-2">
                    <BookOpen size={20} /> StudyNotion
                </div>

                {loading && !otpSent ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-yellow-50" />
                        <p className="text-richblack-200 font-medium">Securing your session...</p>
                    </div>
                ) : (
                    <div className="w-full max-w-[440px] space-y-8">
                        <header className="space-y-3">
                            <h1 className="text-3xl font-bold text-richblack-5">Verify your account</h1>
                            <p className="text-richblack-300">
                                {otpSent
                                    ? `Enter the 6-digit code sent to ${email}`
                                    : "We'll send a one-time password to your email to verify your identity."}
                            </p>
                        </header>

                        {!otpSent ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-richblack-5 ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="roshan@example.com"
                                        className="w-full bg-richblack-800 rounded-xl p-4 text-richblack-5 outline-none focus:ring-2 focus:ring-yellow-50 transition-all shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)]"
                                    />
                                </div>
                                <button
                                    onClick={handleSendOtp}
                                    className="w-full bg-yellow-50 py-4 rounded-xl font-bold text-richblack-900 transition-all hover:scale-[0.98] active:scale-[0.95] shadow-lg shadow-yellow-50/10"
                                >
                                    Get Verification Code
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputsRef.current[index] = el)}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="w-full aspect-square text-center text-2xl font-bold bg-richblack-800 rounded-xl focus:ring-2 focus:ring-yellow-50 text-yellow-50 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)] outline-none"
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={handleVerifyOtp}
                                    className="w-full bg-yellow-50 py-4 rounded-xl font-bold text-richblack-900 transition-all hover:scale-[0.98] shadow-lg shadow-yellow-50/10"
                                >
                                    Complete Verification
                                </button>

                                <div className="flex items-center justify-center">
                                    <button
                                        disabled={timer > 0}
                                        onClick={handleSendOtp}
                                        className="flex items-center gap-2 text-blue-100 disabled:text-richblack-600 font-medium transition-all"
                                    >
                                        <RxCountdownTimer size={20} />
                                        {timer > 0 ? `Resend code in ${timer}s` : "Resend code now"}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-richblack-800">
                            <Link to="/login" className="flex items-center gap-2 text-richblack-400 hover:text-richblack-5 transition-all text-sm font-medium">
                                <BiArrowBack /> Return to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;