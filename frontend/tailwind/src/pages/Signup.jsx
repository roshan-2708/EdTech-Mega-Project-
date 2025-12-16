import React, { useState, useEffect } from "react";
import { signup } from "../services/apis";
import { useNavigate } from "react-router-dom";
import signupImage from "../../src/assets/Images/signup.webp";

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
        accountType: "Student",
    });

    const [loading, setLoading] = useState(false);

    // Load verified email
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
            await signup({ ...formData, email });
            localStorage.removeItem("verifiedEmail");
            alert("Signup successful 🎉");
            navigate("/login");
        } catch (error) {
            alert(error?.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-richblack-900 px-6">
            <div className="flex w-full max-w-6xl gap-10">

                {/* LEFT PART */}
                <div className="flex-1 text-white">
                    <h1 className="text-3xl font-semibold mb-4">
                        Join the millions learning to code with{" "}
                        <span className="text-yellow-300">StudyNotion</span> for free
                    </h1>

                    <p className="text-richblack-200 mb-6">
                        Build skills for today, tomorrow, and beyond.
                        <br />
                        <span className="text-blue-100 italic">
                            Education to future-proof your career.
                        </span>
                    </p>

                    {/* TOGGLE BUTTON */}
                    <div className="flex bg-richblack-800 p-1 rounded-full w-fit mb-6">
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({ ...formData, accountType: "Student" })
                            }
                            className={`px-6 py-2 rounded-full text-sm font-medium transition ${formData.accountType === "Student"
                                    ? "bg-yellow-400 text-black"
                                    : "text-white"
                                }`}
                        >
                            Student
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setFormData({ ...formData, accountType: "Instructor" })
                            }
                            className={`px-6 py-2 rounded-full text-sm font-medium transition ${formData.accountType === "Instructor"
                                    ? "bg-yellow-400 text-black"
                                    : "text-white"
                                }`}
                        >
                            Instructor
                        </button>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* First + Last Name */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm">First Name</label>
                                <input
                                    name="firstName"
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mt-1 rounded bg-richblack-800 text-white"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">Last Name</label>
                                <input
                                    name="lastName"
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mt-1 rounded bg-richblack-800 text-white"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-sm">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                className="w-full p-2 mt-1 rounded bg-richblack-700 text-richblack-200"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="text-sm">Phone Number</label>
                            <input
                                name="contactNumber"
                                onChange={handleChange}
                                required
                                className="w-full p-2 mt-1 rounded bg-richblack-800 text-white"
                            />
                        </div>

                        {/* Passwords */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mt-1 rounded bg-richblack-800 text-white"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 mt-1 rounded bg-richblack-800 text-white"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-400 text-black font-semibold py-2 rounded mt-4 hover:bg-yellow-300 transition"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>
                </div>

                {/* RIGHT PART */}
                <div className="hidden lg:flex flex-1 items-center justify-center">
                    <img
                        src={signupImage}
                        alt="Signup"
                        className="max-w-md"
                    />
                </div>
            </div>
        </div>
    );
};

export default Signup;
