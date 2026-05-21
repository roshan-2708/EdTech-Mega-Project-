import React, { useState } from "react";
import loginPhoto from "../assets/Images/login.webp";
import Instructor from '../assets/Images/Instructor.png';
import frameImg from "../assets/Images/frame.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../services/operations/authAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth || { loading: false });

    const [role, setRole] = useState("Student");
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email, password, role, navigate));
    };

    const handleGoogleLogin = () => {
        const backendBaseURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        window.open(`${backendBaseURL}/api/v1/auth/google`, "_self");
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#000814] relative overflow-hidden px-4 py-16">

            {/* BACKGROUND GLOWING BLOBS FOR PREMIUM LOOK */}
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-900/10 blur-[150px] pointer-events-none" />

            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner border-t-yellow-50 animate-spin rounded-full h-12 w-12 border-4 border-richblack-700"></div>
                </div>
            ) : (
                <div className="w-11/12 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-y-12 md:gap-x-16 z-10">

                    {/* LEFT SECTION - FORM WITH GLASSMORPHISM */}
                    <div className="w-full md:w-[48%] flex flex-col gap-y-6 bg-richblack-900/40 p-6 md:p-8  border border-richblack-800 backdrop-blur-md shadow-2xl">
                        <header className="space-y-3">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-richblack-5 via-richblack-25 to-richblack-100">
                                Welcome Back
                            </h1>
                            <p className="text-base md:text-lg text-richblack-300 leading-relaxed">
                                Build skills for today, tomorrow, and beyond.{" "}
                                <span className="font-edu-sa font-semibold italic text-blue-100 block mt-1">
                                    Education to future-proof your career.
                                </span>
                            </p>
                        </header>

                        {/* ROLE TOGGLE */}
                        <div className="flex bg-richblack-800/80 p-1.5 gap-x-1 my-2 rounded-full border border-richblack-700 w-fit backdrop-blur-sm shadow-inner">
                            {["Student", "Instructor"].map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setRole(tab)}
                                    className={`py-2 px-6 rounded-full transition-all duration-300 font-semibold text-sm tracking-wide ${role === tab
                                        ? "bg-richblack-900 text-yellow-50 shadow-md shadow-black/40 border border-richblack-700"
                                        : "bg-transparent text-richblack-300 hover:text-richblack-5"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-5 w-full">
                            <label className="w-full flex flex-col gap-y-1.5">
                                <p className="text-sm font-medium text-richblack-100 flex items-center gap-x-0.5">
                                    Email Address <sup className="text-pink-200">*</sup>
                                </p>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleOnChange}
                                    placeholder="Enter email address"
                                    className="bg-richblack-800/90 rounded-xl text-richblack-5 w-full p-3 border border-richblack-700 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05)] outline-none focus:border-yellow-50 focus:ring-4 focus:ring-yellow-50/10 transition-all duration-200 placeholder:text-richblack-500"
                                />
                            </label>

                            <label className="relative w-full flex flex-col gap-y-1.5">
                                <p className="text-sm font-medium text-richblack-100 flex items-center gap-x-0.5">
                                    Password <sup className="text-pink-200">*</sup>
                                </p>
                                <div className="relative w-full">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={handleOnChange}
                                        placeholder="Enter Password"
                                        className="bg-richblack-800/90 rounded-xl text-richblack-5 w-full p-3 pr-12 border border-richblack-700 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05)] outline-none focus:border-yellow-50 focus:ring-4 focus:ring-yellow-50/10 transition-all duration-200 placeholder:text-richblack-500"
                                    />
                                    <span
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-richblack-400 hover:text-richblack-200 transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <AiOutlineEyeInvisible fontSize={22} />
                                        ) : (
                                            <AiOutlineEye fontSize={22} />
                                        )}
                                    </span>
                                </div>
                                <Link to="/reset-password" className="self-end mt-1">
                                    <p className="text-xs text-blue-100 hover:text-blue-50 hover:underline transition-colors duration-200 font-medium">
                                        Forgot Password?
                                    </p>
                                </Link>
                            </label>

                            <button
                                type="submit"
                                className="mt-4 w-full rounded-xl font-bold bg-yellow-50 py-3 px-4 text-black border border-yellow-100 hover:bg-yellow-100 hover:scale-[0.98] active:scale-[0.95] transition-all duration-300 shadow-lg shadow-yellow-50/10 tracking-wide"
                            >
                                Sign In
                            </button>

                            <button onClick={handleGoogleLogin} className="flex items-center justify-center gap-2 bg-richblack-800 text-richblack-50 p-3 rounded-md border border-richblack-700 hover:bg-richblack-700 transition-all">
                                <FcGoogle size={22} />
                                <span>Continue with Google</span>
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SECTION - IMAGE WITH PREMIUM SHADOWS */}
                    <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0 group selection:bg-transparent">
                        {/* Decorative background glow behind the image frame */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-yellow-500/10 blur-2xl group-hover:scale-105 transition-all duration-500 rounded-md" />

                        <img
                            src={frameImg}
                            alt="Pattern"
                            width={558}
                            height={504}
                            loading="lazy"
                            className="opacity-80 object-cover"
                        />
                        <img
                            src={role === "Student" ? loginPhoto : Instructor}
                            alt={role === 'Student' ? 'Students' : 'Instructor'}
                            width={558}
                            height={504}
                            loading="lazy"
                            className="absolute -top-4 right-4 z-10  object-cover shadow-2xl border border-richblack-800 group-hover:-translate-y-5 group-hover:translate-x-5 transition-all duration-500"
                        />
                    </div>

                </div>
            )}
        </div>
    );
};

export default Login;