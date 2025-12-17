import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/Images/signup.webp";
import { signup } from "../services/operations/authAPI";

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
        <div className="w-full min-h-screen flex items-center justify-center bg-richblack-900 text-white px-4">
            <div className="w-11/12 max-w-6xl flex flex-col lg:flex-row items-center gap-10 py-10">

                {/* LEFT FORM */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Join the millions learning to code with{" "}
                            <span className="text-yellow-50">StudyNotion</span>
                        </h1>
                        <p className="text-richblack-300 mt-2">
                            Build skills for today, tomorrow, and beyond.
                        </p>
                    </div>

                    {/* ROLE TOGGLE */}
                    <div className="flex bg-richblack-700 w-fit p-1 rounded-full">
                        <button
                            type="button"
                            onClick={() =>
                                setFormData({ ...formData, accountType: "Student" })
                            }
                            className={`px-6 py-2 rounded-full text-sm font-medium transition
                                ${formData.accountType === "Student"
                                    ? "bg-yellow-50 text-black"
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
                            className={`px-6 py-2 rounded-full text-sm font-medium transition
                                ${formData.accountType === "Instructor"
                                    ? "bg-yellow-50 text-black"
                                    : "text-white"
                                }`}
                        >
                            Instructor
                        </button>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* NAME */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm">First Name</label>
                                <input
                                    name="firstName"
                                    required
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 rounded-lg bg-richblack-800 border border-richblack-600"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">Last Name</label>
                                <input
                                    name="lastName"
                                    required
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 rounded-lg bg-richblack-800 border border-richblack-600"
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                className="w-full mt-1 p-2 rounded-lg bg-richblack-700 text-richblack-300 cursor-not-allowed"
                            />
                        </div>

                        {/* PHONE */}
                        <div>
                            <label className="text-sm">Phone Number</label>
                            <input
                                name="contactNumber"
                                required
                                onChange={handleChange}
                                className="w-full mt-1 p-2 rounded-lg bg-richblack-800 border border-richblack-600"
                            />
                        </div>

                        {/* PASSWORDS */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 rounded-lg bg-richblack-800 border border-richblack-600"
                                />
                            </div>

                            <div className="flex-1">
                                <label className="text-sm">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 rounded-lg bg-richblack-800 border border-richblack-600"
                                />
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-yellow-50 text-black font-semibold py-2 rounded-md mt-2 hover:scale-95 transition"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>
                </div>

                {/* RIGHT IMAGE */}
                <div className="hidden lg:flex w-1/2 items-center justify-center">
                    <img
                        src={signupImage}
                        alt="Signup"
                        className="w-[420px] object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default Signup;
