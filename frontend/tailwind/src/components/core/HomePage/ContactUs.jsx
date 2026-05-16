import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { contactUs } from "../../../services/operations/contactApi";
import countryCode from '../../../data/countrycode.json';
import { Send, Loader2, CheckCircle2 } from "lucide-react";

const ContactUs = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitSuccessful },
    } = useForm({
        defaultValues: {
            countryCode: "+91", 
        }
    });

    useEffect(() => {
        setValue("countryCode", "+91");
        if (isSubmitSuccessful) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000);
            reset({
                firstName: "", lastName: "", email: "",
                phone: "", message: "", countryCode: "+91",
            });
        }
    }, [isSubmitSuccessful, reset, setValue]);

    const submitContactForm = async (data) => {
        try {
            setLoading(true);
            await contactUs(data);
        } catch (error) {
            console.error("CONTACT ERROR ---> ", error);
        } finally {
            setLoading(false);
        }
    };

    // Reusable Input Class
    const inputStyle = "w-full bg-white/[0.03] border border-white/10 focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 rounded-2xl px-5 py-4 text-white outline-none transition-all duration-300 placeholder:text-gray-600 hover:bg-white/[0.05]";

    return (
        <div className="relative">
            {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Message Received!</h3>
                    <p className="text-gray-400 max-w-[250px]">Our strategy team will reach out to you shortly.</p>
                    <button onClick={() => setSubmitted(false)} className="text-yellow-400 text-sm font-medium hover:underline">Send another message</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(submitContactForm)} className="space-y-7" noValidate>

                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">First Name</label>
                            <input
                                type="text"
                                placeholder="Roshan"
                                className={inputStyle}
                                {...register("firstName", { required: "Required" })}
                            />
                            {errors.firstName && <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1">{errors.firstName.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">Last Name</label>
                            <input
                                type="text"
                                placeholder="Kumar"
                                className={inputStyle}
                                {...register("lastName")}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">Work Email</label>
                        <input
                            type="email"
                            placeholder="roshan@company.com"
                            className={inputStyle}
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                            })}
                        />
                        {errors.email && <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1">{errors.email.message}</span>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">
                            Phone Number
                        </label>
                        <div className="flex gap-3">
                            <select
                                className="w-[110px] bg-white/[0.03] border border-white/10 rounded-2xl px-3 py-4 text-white outline-none cursor-pointer hover:bg-white/[0.05] transition-all appearance-none"
                                {...register("countryCode")}
                                defaultValue="+91" // HTML level default
                            >
                                {countryCode.map((element, index) => (
                                    <option key={index} value={element.code} className="bg-[#0f0f0f] text-white">
                                        {element.code}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="tel"
                                placeholder="98765 43210"
                                className={inputStyle}
                                {...register("phone", {
                                    required: "Required",
                                    pattern: { value: /^[0-9]{10}$/, message: "Invalid phone" }
                                })}
                            />
                        </div>
                        {errors.phone && (
                            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1">
                                {errors.phone.message}
                            </span>
                        )}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">Project Details</label>
                        <textarea
                            rows="4"
                            placeholder="Tell us what you're building..."
                            className={`${inputStyle} resize-none`}
                            {...register("message", { required: "Message is required" })}
                        />
                        {errors.message && <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider ml-1">{errors.message.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative group overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-600 hover:from-yellow-500 hover:to-yellow-500 text-white font-bold py-5 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-white/80" />
                        ) : (
                            <>
                                <span className="tracking-tight">Get Started Now</span>
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                            </>
                        )}

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000" />
                    </button>
                </form>
            )}
        </div>
    );
};

export default ContactUs;