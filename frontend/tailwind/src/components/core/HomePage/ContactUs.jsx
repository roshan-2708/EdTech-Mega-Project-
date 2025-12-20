import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { contactUs } from "../../../services/operations/contactApi";
import countryCode from '../../../data/countrycode.json'
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
        <div className="bg-yellow-50 rounded-2xl flex items-center justify-center ">
            <form
                onSubmit={handleSubmit(submitContactForm)}
                className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6"
            >
                <h2 className="text-3xl font-bold text-white text-center">
                    Contact Us
                </h2>
                <p className="text-gray-400 text-center">
                    We'd love to hear from you
                </p>

                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-gray-300 text-sm">First Name</label>
                        <input
                            type="text"
                            placeholder="John"
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-400"
                            {...register("firstName", { required: true })}
                        />
                        {errors.firstName && (
                            <p className="text-pink-400 text-sm mt-1">
                                First name is required
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm">Last Name</label>
                        <input
                            type="text"
                            placeholder="Doe"
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-400"
                            {...register("lastName", { required: true })}
                        />
                        {errors.lastName && (
                            <p className="text-pink-400 text-sm mt-1">
                                Last name is required
                            </p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="text-gray-300 text-sm">Email Address</label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-400"
                        {...register("email", { required: true })}
                    />
                    {errors.email && (
                        <p className="text-pink-400 text-sm mt-1">
                            Email is required
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="text-gray-300 text-sm">Phone Number</label>

                    <div className="flex gap-3">
                        {/* Country Code */}
                        <select
                            className="mt-1 px-1 py-2 rounded-lg bg-gray-700 text-white outline-none w-[90px] overflow-hidden "
                            {...register("countryCode", { required: true })}
                        >
                            {countryCode.map((ele, idx) => (
                                <option
                                    key={idx}
                                    value={ele.code}
                                // label={ele.code}   // closed state shows only +91
                                >
                                    {ele.code} - {ele.country}
                                </option>
                            ))}
                        </select>


                        {/* Phone Input */}
                        <input
                            type="tel"
                            placeholder="9876543210"
                            className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-400"
                            {...register("phone", { required: true })}
                        />
                    </div>
                </div>


                {/* Message */}
                <div>
                    <label className="text-gray-300 text-sm">Message</label>
                    <textarea
                        rows="4"
                        placeholder="Write your message..."
                        className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        {...register("message", { required: true })}
                    />
                    {errors.message && (
                        <p className="text-pink-400 text-sm mt-1">
                            Message is required
                        </p>
                    )}
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition disabled:opacity-60"
                >
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </form>
        </div>
    );
};

export default ContactUs;
