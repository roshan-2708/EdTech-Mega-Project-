import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { contactUs } from "../../../services/operations/contactApi";
import countryCode from '../../../data/countrycode.json';

const ContactUs = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitSuccessful },
    } = useForm();

    useEffect(() => {
        setValue("countryCode", "+91");

        if (isSubmitSuccessful) {
            reset({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                message: "",
                countryCode: "+91",
            });
        }
    }, [isSubmitSuccessful, reset, setValue]);

    const submitContactForm = async (data) => {
        try {
            setLoading(true);
            const response = await contactUs(data);
            console.log("CONTACT RESPONSE ---> ", response);
        } catch (error) {
            console.error("CONTACT ERROR ---> ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-transparent from-richblack-900 via-black to-richblack-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                
                {/* Contact Form Card */}
                <div className="bg-richblack-800 border border-richblack-700 rounded-3xl p-8 md:p-12 shadow-2xl shadow-richblack-900/50">
                    <form
                        onSubmit={handleSubmit(submitContactForm)}
                        className="space-y-8"
                        noValidate
                    >
                        {/* Name Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium text-richblack-200">
                                    First Name <span className="text-pink-400">*</span>
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="Enter your first name"
                                    className="w-full px-4 py-3 rounded-xl bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                                    {...register("firstName", { 
                                        required: "First name is required" 
                                    })}
                                />
                                {errors.firstName && (
                                    <p className="text-pink-400 text-sm mt-1 animate-pulse">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium text-richblack-200">
                                    Last Name <span className="text-pink-400">*</span>
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Enter your last name"
                                    className="w-full px-4 py-3 rounded-xl bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                                    {...register("lastName", { 
                                        required: "Last name is required" 
                                    })}
                                />
                                {errors.lastName && (
                                    <p className="text-pink-400 text-sm mt-1 animate-pulse">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-richblack-200">
                                Email Address <span className="text-pink-400">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-pink-400 text-sm mt-1 animate-pulse">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium text-richblack-200">
                                Phone Number <span className="text-pink-400">*</span>
                            </label>
                            <div className="flex gap-3">
                                <select
                                    id="countryCode"
                                    className="w-28 px-3 py-3 rounded-xl bg-richblack-700 border border-richblack-600 text-richblack-5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 appearance-none bg-no-repeat bg-right"
                                    style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")" }}
                                    {...register("countryCode", { required: "Country code is required" })}
                                >
                                    {countryCode.slice(0, 15).map((country, idx) => (
                                        <option key={idx} value={country.code}>
                                            {country.code}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    className="flex-1 px-4 py-3 rounded-xl bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                                    {...register("phone", { 
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Phone number must be 10 digits"
                                        }
                                    })}
                                />
                            </div>
                            {errors.countryCode && (
                                <p className="text-pink-400 text-sm mt-1 animate-pulse">
                                    {errors.countryCode.message}
                                </p>
                            )}
                            {errors.phone && (
                                <p className="text-pink-400 text-sm mt-1 animate-pulse">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-richblack-200">
                                Message <span className="text-pink-400">*</span>
                            </label>
                            <textarea
                                id="message"
                                rows="5"
                                placeholder="Tell us about your question or issue..."
                                className="w-full px-4 py-3 rounded-xl bg-richblack-700 border border-richblack-600 text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-vertical transition-all duration-200"
                                {...register("message", { 
                                    required: "Message is required",
                                    minLength: {
                                        value: 10,
                                        message: "Message must be at least 10 characters"
                                    }
                                })}
                            />
                            {errors.message && (
                                <p className="text-pink-400 text-sm mt-1 animate-pulse">
                                    {errors.message.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 text-richblack-900 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        Sending Message...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <svg className="group-hover:translate-x-1 transition-transform duration-200 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>

                
            </div>
        </main>
    );
};

export default ContactUs;
