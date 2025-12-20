import React from "react";
import Footer from "../components/universal/Footer";
import ContactUs from "../components/core/HomePage/ContactUs";
import {
    ChatBubbleLeftRightIcon,
    MapPinIcon,
    PhoneIcon,
} from "@heroicons/react/24/solid";

const Contact = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Contact Info Section */}
            <section className="bg-gray-900 text-gray-100 py-16 px-6 md:px-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20">
                    {/* Left Side: Contact Cards */}
                    <div className="flex-1 flex flex-col gap-6 text-white">
                        {/* Chat Card */}
                        <div className="flex items-start gap-4 p-5 bg-gray-800 rounded-xl shadow-lg hover:bg-blue-600 transition-colors">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Chat with us</h3>
                                <p className="text-gray-300 mt-1">
                                    Our friendly team is here to help with your queries.
                                </p>
                                <p className="mt-1 text-gray-200 font-mono">support@example.com</p>
                            </div>
                        </div>

                        {/* Visit Card */}
                        <div className="flex items-start gap-4 p-5 bg-gray-800 rounded-xl shadow-lg hover:bg-blue-600 transition-colors">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
                                <MapPinIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Visit our office</h3>
                                <p className="text-gray-300 mt-1">
                                    123 Innovation Street, Tech Park, Bengaluru, India
                                </p>
                            </div>
                        </div>

                        {/* Call Card */}
                        <div className="flex items-start gap-4 p-5 bg-gray-800 rounded-xl shadow-lg hover:bg-blue-600 transition-colors">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
                                <PhoneIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Call us</h3>
                                <p className="text-gray-300 mt-1">Mon – Fri, 9:00 AM – 6:00 PM</p>
                                <p className="mt-1 text-gray-200 font-mono">+91 78940 75618</p>
                            </div>
                        </div>

                        <p className="mt-6 text-gray-400 text-sm">
                            Prefer email? Just drop a line and attach any docs or mockups.
                        </p>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="flex-1 bg-gray-50 rounded-2xl shadow-xl p-8 md:p-12 text-white">
                        {/* Heading */}
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            Got an idea? We’ve got the skills. Let’s team up.
                        </h1>

                        {/* Subheading */}
                        <p className="text-gray-600 mb-8 text-lg">
                            Tell us more about yourself and what you’ve got in mind.
                        </p>

                        {/* Contact Form */}
                        <div className=" p-6 md:p-8 rounded-xl shadow-inner">
                            <ContactUs />
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Contact;
