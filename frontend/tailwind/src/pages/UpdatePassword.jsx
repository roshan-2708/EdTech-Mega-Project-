import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { resetPassword } from "../services/operations/authAPI";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
const UpdatePassword = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { loading } = useSelector((state) => state.auth);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const { password, confirmPassword } = formData;

    // 🔐 Password Rules
    const rules = {
        firstCapital: /^[A-Z]/.test(password),
        minLength: password.length >= 8,
        number: /[0-9]/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isPasswordValid = Object.values(rules).every(Boolean);
    const passwordsMatch =
        password && confirmPassword && password === confirmPassword;

    const isFormValid = isPasswordValid && passwordsMatch;

    const handleOnChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (!passwordsMatch) {
            toast.error("Passwords do not match");
            return;
        }

        const token = location.pathname.split("/").at(-1);
        dispatch(resetPassword(password, confirmPassword, token));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    Choose new password
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Almost done. Enter your new password.
                </p>

                <form onSubmit={handleOnSubmit} className="space-y-4">
                    {/* New Password */}
                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={handleOnChange}
                                placeholder="New Password"
                                required
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-sm text-blue-600"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {/* 🔁 Animated Rules */}
                        <ul className="mt-3 space-y-1 text-sm">
                            {[
                                ["First letter capital", rules.firstCapital],
                                ["Minimum 8 characters", rules.minLength],
                                ["At least 1 number", rules.number],
                                ["At least 1 special character", rules.specialChar],
                            ].map(([text, valid]) => (
                                <li
                                    key={text}
                                    className={`transition-all duration-300 ${valid ? "text-green-600" : "text-red-500"
                                        }`}
                                >
                                    {valid ? "✔" : "✖"} {text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleOnChange}
                            placeholder="Confirm Password"
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-2 text-sm text-blue-600"
                        >
                            {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                    </div>

                    {/* Error */}
                    {confirmPassword && !passwordsMatch && (
                        <p className="text-red-500 text-sm">
                            Passwords do not match
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!isFormValid || loading}
                        className={`w-full py-2 rounded-lg text-white transition-all ${isFormValid
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link
                        to="/login"
                        className="inline-block px-4 py-2 border border-blue-600
                text-blue-600 rounded-lg hover:bg-blue-50
                transition"
                    >
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default UpdatePassword;
