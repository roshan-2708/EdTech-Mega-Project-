import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/Images/signup.webp";
import Instructor from "../assets/Images/Instructor.png";
import frameImg from "../assets/Images/frame.png"; // Dynamic frame used in login theme
import { signup } from "../services/operations/authAPI";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
        accountType: "Student",
    });

    // 🔒 Protect route – email must be verified
    useEffect(() => {
        const savedEmail = localStorage.getItem("verifiedEmail");
        if (!savedEmail) {
            navigate("/verify-email");
        } else {
            setEmail(savedEmail);
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords do not match");
        }

        try {
            setLoading(true);
            const res = await signup({ ...formData, email });
            if (res.data.success) {
                localStorage.removeItem("verifiedEmail");
                alert("Signup successful!");
                navigate("/login");
            } else {
                alert(res.data.message || "Signup failed");
            }
        } catch (err) {
            alert(err?.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#000814] relative overflow-hidden px-4 py-16">

            {/* PREMIUM BACKGROUND GLOWING BLOBS */}
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-yellow-900/10 blur-[150px] pointer-events-none" />

            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="spinner border-t-yellow-50 animate-spin rounded-full h-12 w-12 border-4 border-richblack-700"></div>
                </div>
            ) : (
                <div className="w-11/12 max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-y-12 lg:gap-x-16 z-10">

                    {/* LEFT SECTION - FORM CONTAINER WITH GLASSMORPHISM */}
                    <div className="w-full lg:w-[52%] flex flex-col gap-y-6 bg-richblack-900/40 p-6 md:p-8  border border-richblack-800 backdrop-blur-md shadow-2xl">
                        <header className="space-y-3">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-richblack-5 via-richblack-25 to-richblack-100">
                                Join the millions learning to code with{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-50 to-yellow-200">StudyNotion</span>
                            </h1>
                            <p className="text-base text-richblack-300 leading-relaxed">
                                Build skills for today, tomorrow, and beyond.
                            </p>
                        </header>

                        {/* ROLE TOGGLE */}
                        <div className="flex bg-richblack-800/80 p-1.5 gap-x-1 my-1 rounded-full border border-richblack-700 w-fit backdrop-blur-sm shadow-inner">
                            {["Student", "Instructor"].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, accountType: type })}
                                    className={`py-2 px-6 rounded-full transition-all duration-300 font-semibold text-sm tracking-wide ${formData.accountType === type
                                        ? "bg-richblack-900 text-yellow-50 shadow-md shadow-black/40 border border-richblack-700"
                                        : "bg-transparent text-richblack-300 hover:text-richblack-5"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* FORM */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">

                            {/* FIRSTNAME & LASTNAME ROW */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <label className="flex-1 flex flex-col gap-y-1.5">
                                    <p className="text-sm font-medium text-richblack-100">First Name <sup className="text-pink-200">*</sup></p>
                                    <input
                                        required
                                        type="text"
                                        name="firstName"
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        className="bg-richblack-800/90 rounded-xl text-richblack-5 w-full p-3 border border-richblack-700 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05)] outline-none focus:border-yellow-50 focus:ring-4 focus:ring-yellow-50/10 transition-all duration-200 placeholder:text-richblack-500"
                                    />
                                </label>
                                <label className="flex-1 flex flex-col gap-y-1.5">
                                    <p className="text-sm font-medium text-richblack-100">Last Name <sup className="text-pink-200">*</sup></p>
                                    <input
                                        required
                                        type="text"
                                        name="lastName"
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                        className="bg-richblack-800/90 rounded-xl text-richblack-5 w-full p-3 border border-richblack-700 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05)] outline-none focus:border-yellow-50 focus:ring-4 focus:ring-yellow-50/10 transition-all duration-200 placeholder:text-richblack-500"
                                    />
                                </label>
                            </div>

                            {/* EMAIL ADDRESS (READ-ONLY) */}
                            <label className="w-full flex flex-col gap-y-1.5">
                                <p className="text-sm font-medium text-richblack-100">Email Address</p>
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="bg-richblack-800/50 rounded-xl text-richblack-400 w-full p-3 border border-richblack-800 shadow-inner outline-none cursor-not-allowed select-none font-medium"
                                />
                            </label>

                            {/* PHONE NUMBER */}
                            <label className="w-full flex flex-col gap-y-1.5">
                                <p className="text-sm font-medium text-richblack-100">Phone Number <sup className="text-pink-200">*</sup></p>
                                <input
                                    required
                                    type="tel"
                                    name="contactNumber"
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="bg-richblack-800/90 rounded-xl text-richblack-5 w-full p-3 border border-richblack-700 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05)] outline-none focus:border-yellow-50 focus:ring-4 focus:ring-yellow-50/10 transition-all duration-200 placeholder:text-richblack-500"
                                />
                            </label>

                            {/* PASSWORD & CONFIRM PASSWORD ROW */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* PASSWORD */}
                                <label className="flex-1 flex flex-col gap-y-1.5 relative">
                                    <p className="text-sm font-medium text-richblack-100">Create Password <sup className="text-pink-200">*</sup></p>
                                    <div className="relative w-full">
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                            className="bg-richblack-800/90 rounded-xl text-richblack-5 w-full p-3 pr-12 border border-richblack-700 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05)] outline-none focus:border-yellow-50 focus:ring-4 focus:ring-yellow-50/10 transition-all duration-200 placeholder:text-richblack-500"
                                        />
                                        <span
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-richblack-400 hover:text-richblack-200 transition-colors duration-200"
                                        >
                                            {showPassword ? <AiOutlineEyeInvisible fontSize={22} /> : <AiOutlineEye fontSize={22} />}
                                        </span>
                                    </div>
                                </label>

                                {/* CONFIRM PASSWORD */}
                                <label className="flex-1 flex flex-col gap-y-1.5 relative">
                                    <p className="text-sm font-medium text-richblack-100">Confirm Password <sup className="text-pink-200">*</sup></p>
                                    <div className="relative w-full">
                                        <input
                                            required
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            onChange={handleChange}
                                            placeholder="Confirm password"
                                            className="bg-richblack-800/90 rounded-xl text-richblack-5 w-full p-3 pr-12 border border-richblack-700 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.05)] outline-none focus:border-yellow-50 focus:ring-4 focus:ring-yellow-50/10 transition-all duration-200 placeholder:text-richblack-500"
                                        />
                                        <span
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer text-richblack-400 hover:text-richblack-200 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? <AiOutlineEyeInvisible fontSize={22} /> : <AiOutlineEye fontSize={22} />}
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-5 w-full rounded-xl font-bold bg-yellow-50 py-3 px-4 text-black border border-yellow-100 hover:bg-yellow-100 hover:scale-[0.98] active:scale-[0.95] transition-all duration-300 shadow-lg shadow-yellow-50/10 tracking-wide disabled:bg-richblack-600 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT SECTION - COMPLEMENTARY HERO IMAGE WITH HOVER ANIMATION */}
                    <div className="hidden lg:block relative mx-auto w-11/12 max-w-[450px] lg:mx-0 group selection:bg-transparent">
                        {/* Interactive backdrop glow mesh */}
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
                            src={formData.accountType === "Student" ? signupImage : Instructor}
                            alt={formData.accountType === "Student" ? "Students" : "Instructor"}
                            width={558}
                            height={504}
                            loading="lazy"
                            className="absolute -top-4 right-4 z-10  object-cover shadow-2xl border border-richblack-800 group-hover:-translate-y-5 group-hover:translate-x-5 transition-all duration-500"
                        />
                    </div>

                </div>
            )
            }
        </div >
    );
};

export default Signup;