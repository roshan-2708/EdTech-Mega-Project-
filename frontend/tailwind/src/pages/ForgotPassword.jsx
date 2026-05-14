import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPasswordResetToken } from "../services/operations/authAPI";
import { BiArrowBack, BiShieldQuarter } from "react-icons/bi";
import { HiOutlineMailOpen } from "react-icons/hi";
import { Loader2, KeyRound, Sparkles } from "lucide-react";

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth || { loading: false });

    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email, setEmailSent));
    };

    return (
        <div className="min-h-screen w-full flex bg-[#000814]">

            {/* LEFT SIDE: Branding & Recovery Context */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-richblack-900 to-[#00122e] p-16 flex-col justify-between relative overflow-hidden">
                {/* Subtle Decorative Glow */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-yellow-50 text-2xl font-bold mb-20">
                        <div className="bg-yellow-50 text-richblack-900 p-1.5 rounded-lg shadow-[0_0_20px_rgba(255,214,10,0.3)]">
                            <KeyRound size={24} />
                        </div>
                        StudyNotion
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-blue-100 font-medium tracking-wide uppercase text-xs">
                                <Sparkles size={14} />
                                Security first platform
                            </div>
                            <h2 className="text-5xl font-bold text-white leading-tight">
                                Regain access to your <br />
                                <span className="text-blue-200">learning dashboard.</span>
                            </h2>
                        </div>

                        <div className="grid gap-8">
                            {[
                                {
                                    title: "Secure Encryption",
                                    desc: "Your data is protected with enterprise-grade security protocols.",
                                    icon: BiShieldQuarter
                                },
                                {
                                    title: "Instant Recovery",
                                    desc: "Quickly reset your password and get back to your courses in minutes.",
                                    icon: HiOutlineMailOpen
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 items-start">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-blue-100">
                                        <item.icon size={26} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-richblack-5 font-semibold text-lg">{item.title}</h4>
                                        <p className="text-richblack-400 text-sm max-w-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex gap-6 text-richblack-500 text-xs font-medium">
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Support Center</span>
                </div>
            </div>

            {/* RIGHT SIDE: Recovery Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">

                    {/* Icon Circle */}
                    <div className="w-16 h-16 bg-richblack-800 border border-richblack-700 rounded-2xl flex items-center justify-center text-yellow-50 shadow-xl">
                        {!emailSent ? <KeyRound size={32} /> : <HiOutlineMailOpen size={32} />}
                    </div>

                    <header className="space-y-3">
                        <h1 className="text-3xl font-bold text-richblack-5 tracking-tight">
                            {!emailSent ? "Forgot password?" : "Check your email"}
                        </h1>
                        <p className="text-richblack-300 leading-relaxed">
                            {!emailSent
                                ? "No worries, we'll send you reset instructions. Please enter the email associated with your account."
                                : `We've sent a password reset link to ${email}. Please check your inbox and spam folder.`}
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!emailSent && (
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-richblack-5 ml-1">
                                    Email Address
                                </label>
                                <input
                                    required
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full bg-richblack-800 border border-richblack-700 focus:border-yellow-50 focus:ring-4 focus:ring-yellow-50/10 rounded-xl p-4 text-richblack-5 outline-none transition-all placeholder:text-richblack-600 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.1)]"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-50 py-4 rounded-xl font-bold text-richblack-900 transition-all hover:scale-[0.98] active:scale-[0.96] shadow-lg shadow-yellow-50/10 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                !emailSent ? "Reset Password" : "Resend Link"
                            )}
                        </button>
                    </form>

                    <div className="pt-6 border-t border-richblack-800">
                        <Link to="/login" className="group flex items-center gap-2 text-richblack-400 hover:text-richblack-5 transition-all text-sm font-medium">
                            <BiArrowBack className="group-hover:-translate-x-1 transition-transform" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;