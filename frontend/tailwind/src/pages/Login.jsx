import React, { useState } from "react";
import CTAButton from "../components/core/HomePage/Button";
import loginPhoto from "../assets/Images/login.webp";
import Instructor from '../assets/Images/Instructor.png'
import frameImg from "../assets/Images/frame.png"; // Frame background for image
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../services/operations/authAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

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

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#000814] px-4 py-20">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner"></div> {/* Add your spinner CSS */}
                </div>
            ) : (
                <div className="w-11/12 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-y-12 md:gap-x-12">

                    {/* LEFT SECTION - FORM */}
                    <div className="w-full md:w-[45%] flex flex-col gap-y-6">
                        <header className="space-y-3">
                            <h1 className="text-4xl font-bold text-richblack-5">
                                Welcome Back
                            </h1>
                            <p className="text-lg text-richblack-300 leading-[1.6]">
                                Build skills for today, tomorrow, and beyond.{" "}
                                <span className="font-edu-sa font-bold italic text-blue-100">
                                    Education to future-proof your career.
                                </span>
                            </p>
                        </header>

                        {/* ROLE TOGGLE */}
                        <div className="flex bg-richblack-800 p-1 gap-x-1 my-4 rounded-full border-b border-richblack-600 w-fit">
                            {["Student", "Instructor"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setRole(tab)}
                                    className={`${role === tab
                                            ? "bg-richblack-900 text-richblack-5"
                                            : "bg-transparent text-richblack-200"
                                        } py-2 px-6 rounded-full transition-all duration-200 font-medium text-sm`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4 w-full">
                            <label className="w-full">
                                <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                                    Email Address <sup className="text-pink-200">*</sup>
                                </p>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleOnChange}
                                    placeholder="Enter email address"
                                    style={{
                                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    }}
                                    className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] border-none outline-none focus:ring-2 focus:ring-yellow-50 transition-all"
                                />
                            </label>

                            <label className="relative">
                                <p className="text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem]">
                                    Password <sup className="text-pink-200">*</sup>
                                </p>
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={handleOnChange}
                                    placeholder="Enter Password"
                                    style={{
                                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    }}
                                    className="bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] pr-12 border-none outline-none focus:ring-2 focus:ring-yellow-50 transition-all"
                                />
                                <span
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                                >
                                    {showPassword ? (
                                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                    ) : (
                                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                    )}
                                </span>
                                <Link to="/reset-password">
                                    <p className="text-xs mt-1 text-blue-100 max-w-fit ml-auto hover:underline cursor-pointer">
                                        Forgot Password?
                                    </p>
                                </Link>
                            </label>

                            <button
                                type="submit"
                                className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900 hover:scale-95 transition-all duration-200"
                            >
                                Sign In
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SECTION - IMAGE WITH FRAME */}
                    <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
                        <img
                            src={frameImg}
                            alt="Pattern"
                            width={558}
                            height={504}
                            loading="lazy"
                        />
                        <img
                            src={role === "Student" ? loginPhoto : Instructor}
                            alt={role === 'Student' ? 'Students' : 'Instructor'}
                            width={558}
                            height={504}
                            loading="lazy"
                            className="absolute -top-4 right-4 z-10 rounded-md"
                        />
                    </div>

                </div>
            )}
        </div>
    );
};

export default Login;