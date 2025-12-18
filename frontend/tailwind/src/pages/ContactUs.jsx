import React from "react";
import Footer from "../components/universal/Footer";
import {
    ChatBubbleLeftRightIcon,
    MapPinIcon,
    PhoneIcon,
} from "@heroicons/react/24/solid";

const ContactUs = () => {
    return (
        <div>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Top heading */}
                    <div className="px-8 pt-8 pb-4 border-b border-gray-100 text-center">
                        <p className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
                            Contact us
                        </p>
                        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                            Got an idea? Let&apos;s build it together.
                        </h1>
                        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
                            Tell us a bit about yourself and what you&apos;re looking to build.
                            The team will get back within 24–48 hours.
                        </p>
                    </div>

                    {/* Main section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                        {/* Left info panel */}
                        <div className="bg-gray-900 text-gray-100 p-8 md:p-10 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Reach out directly</h2>

                                <div className="space-y-6">
                                    {/* Chat */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                            <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">
                                                Chat with us
                                            </h3>
                                            <p className="text-sm text-gray-300">
                                                Our friendly team is here to help with your queries.
                                            </p>
                                            <p className="mt-1 text-sm text-gray-200">
                                                support@example.com
                                            </p>
                                        </div>
                                    </div>

                                    {/* Visit */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                            <MapPinIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">
                                                Visit our office
                                            </h3>
                                            <p className="text-sm text-gray-300">
                                                123 Innovation Street, Tech Park, Bengaluru, India
                                            </p>
                                        </div>
                                    </div>

                                    {/* Call */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                            <PhoneIcon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">
                                                Call us
                                            </h3>
                                            <p className="text-sm text-gray-300">
                                                Mon – Fri, 9:00 AM – 6:00 PM
                                            </p>
                                            <p className="mt-1 text-sm text-gray-200">
                                                +91 78940 75618
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Optional footer note */}
                            <div className="mt-8 text-xs text-gray-400">
                                Prefer email? Just drop a line and attach any docs or mockups.
                            </div>
                        </div>

                        {/* Right form panel */}
                        <div className="md:col-span-2 p-8 md:p-10">
                            <form className="space-y-6">
                                {/* Name fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="John"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Email and phone */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone number
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Project type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        What are you looking for?
                                    </label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option>Web application</option>
                                        <option>Mobile application</option>
                                        <option>UI/UX design</option>
                                        <option>Consultation</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tell us about your idea
                                    </label>
                                    <textarea
                                        rows="4"
                                        placeholder="Share a brief about your project, timeline, and budget (if known)."
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Consent */}
                                <div className="flex items-start gap-2">
                                    <input
                                        id="consent"
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600
                             focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="consent"
                                        className="text-xs md:text-sm text-gray-600"
                                    >
                                        By submitting this form, you agree to be contacted about your
                                        request and related services.
                                    </label>
                                </div>

                                {/* Submit */}
                                <div className="flex items-center justify-between gap-4 pt-2">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center px-6 py-2.5
                             rounded-lg bg-blue-600 text-white text-sm font-medium
                             shadow-sm hover:bg-blue-700 focus:outline-none
                             focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                             transition-colors"
                                    >
                                        Send message
                                    </button>
                                    <p className="text-xs text-gray-500">
                                        You will receive a confirmation email after submitting.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
            <Footer></Footer>
        </div>

    );
};

export default ContactUs;
