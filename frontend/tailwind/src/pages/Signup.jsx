import React, { useState, useEffect } from "react";
import { signup } from "../services/apis";
import { useNavigate } from "react-router-dom";

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

    useEffect(() => {
        const savedEmail = localStorage.getItem("verifiedEmail");
        if (!savedEmail) navigate("/verify-email");
        setEmail(savedEmail);
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup({ ...formData, email });
            localStorage.removeItem("verifiedEmail");
            alert("Signup successful");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-96"
            >
                <h2 className="text-xl font-bold mb-4 text-center">
                    Sign Up
                </h2>

                <input value={email} readOnly className="w-full border p-2 mb-2 bg-gray-100" />

                <input name="firstName" placeholder="First Name" onChange={handleChange} className="w-full border p-2 mb-2" />
                <input name="lastName" placeholder="Last Name" onChange={handleChange} className="w-full border p-2 mb-2" />

                <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 mb-2" />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="w-full border p-2 mb-2" />

                <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} className="w-full border p-2 mb-4" />

                <button className="w-full bg-blue-600 text-white py-2 rounded">
                    Create Account
                </button>
            </form>
        </div>
    );
};

export default Signup;
