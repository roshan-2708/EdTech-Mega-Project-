import React, { useState } from "react";
import CTAButton from "../components/core/HomePage/Button";
import loginPhoto from "../assets/Images/login.webp";

const Login = () => {
    const [role, setRole] = useState("Student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        console.log("Login button clicked");

        try {
            const response = await fetch(
                "http://localhost:5000/api/v1/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, role }),
                }
            );

            const data = await response.json();
            console.log("API Response:", data); // 👈 ALWAYS SEE THIS

            if (response.ok) {
                setMessage("Login Successful!");

                // ✅ SAFE LOGGING (works with any backend shape)
                console.log("Email:", data.email || data.user?.email);
                console.log("Role:", data.role || data.user?.role);

                localStorage.setItem("token", data.token);

                // redirect AFTER logs
                setTimeout(() => {
                    window.location.href = "/";
                }, 500);
            } else {
                setMessage(data.message || "Login Failed");
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error");
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-richblack-900 text-white">
            <div className="w-11/12 max-w-5xl flex flex-col md:flex-row items-center gap-10 py-10">

                {/* LEFT */}
                <div className="w-full md:w-1/2 flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome Back</h1>
                        <p className="text-richblack-300">
                            Discover your passions, Be Unstoppable
                        </p>
                    </div>

                    {/* ROLE TOGGLE */}
                    <div className="flex bg-richblack-700 w-fit p-1 rounded-full">
                        <button
                            type="button"
                            onClick={() => setRole("Student")}
                            className={`px-5 py-2 rounded-full text-sm ${role === "Student"
                                    ? "bg-yellow-50 text-black"
                                    : "text-white"
                                }`}
                        >
                            Student
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole("Instructor")}
                            className={`px-5 py-2 rounded-full text-sm ${role === "Instructor"
                                    ? "bg-yellow-50 text-black"
                                    : "text-white"
                                }`}
                        >
                            Instructor
                        </button>
                    </div>

                    {/* INPUTS */}
                    <div className="flex flex-col gap-3 w-full">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="bg-richblack-800 border border-richblack-600 p-2 rounded-lg"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            className="bg-richblack-800 border border-richblack-600 p-2 rounded-lg"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* MESSAGE */}
                    {message && (
                        <p className="text-yellow-200 text-sm">{message}</p>
                    )}

                    {/* LOGIN BUTTON */}
                    <CTAButton active={true} onClick={handleLogin}>
                        Login
                    </CTAButton>
                </div>

                {/* RIGHT */}
                <div className="w-full md:w-1/2 flex items-center justify-center">
                    <img
                        src={loginPhoto}
                        alt="Login Illustration"
                        className="w-[350px] object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
