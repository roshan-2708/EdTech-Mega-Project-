import React from "react";
import Footer from "../components/universal/Footer";
import ContactUs from "../components/core/HomePage/ContactUs";
import {
    ChatBubbleLeftRightIcon,
    MapPinIcon,
    PhoneIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

const Contact = () => {
    return (
        <div className="flex flex-col min-h-screen bg-richblack-900">
            {/* Main Content */}
            <main className="flex-grow relative overflow-hidden">

                {/* Background Decorations */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full -z-10" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-pink-600/10 blur-[120px] rounded-full -z-10" />

                <section className="max-w-7xl mx-auto py-20 px-6 lg:px-12">

                    {/* Header Section */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium">
                            <SparklesIcon className="h-4 w-4" />
                            <span>Available for new projects</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                            Let's build something <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-300">
                                extraordinary together.
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Have a vision? We have the expertise to bring it to life.
                            Fill out the form or reach out via our contact channels.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* Left Side: Contact Info (4 Columns) */}
                        <div className="lg:col-span-5 space-y-6">
                            {[
                                {
                                    title: "Chat with us",
                                    desc: "Speak to our friendly team.",
                                    info: "supportportfoliobuilder@gmail.com",
                                    icon: ChatBubbleLeftRightIcon,
                                    color: "text-blue-400"
                                },
                                {
                                    title: "Visit us",
                                    desc: "Visit our office HQ in Bengaluru.",
                                    info: "123 Innovation Street, Tech Park",
                                    icon: MapPinIcon,
                                    color: "text-purple-400"
                                },
                                {
                                    title: "Call us",
                                    desc: "Mon-Fri from 9am to 6pm.",
                                    info: "+91 78940 75618",
                                    icon: PhoneIcon,
                                    color: "text-cyan-400"
                                }
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="group p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-yellow-500/30 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl bg-white/5 ${item.color}`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{item.title}</h3>
                                            <p className="text-gray-400 text-sm">{item.desc}</p>
                                            <p className="text-gray-200 mt-1 font-medium">{item.info}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="p-8 rounded-2xl bg-gradient-to-br from-yellow-600 to-yellow-400 text-white hidden lg:block">
                                <h4 className="text-xl font-bold mb-2">Why choose us?</h4>
                                <ul className="space-y-3 text-blue-100 text-sm">
                                    <li className="flex items-center gap-2">✓ 24/7 Priority Support</li>
                                    <li className="flex items-center gap-2">✓ Dedicated Project Manager</li>
                                    <li className="flex items-center gap-2">✓ Scalable Technical Solutions</li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Side: Form Card (7 Columns) */}
                        <div className="lg:col-span-7">
                            <div className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                                <div className="bg-[#0f0f0f] rounded-[calc(1.5rem-1px)] p-8 md:p-10 shadow-2xl">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                                        <p className="text-gray-400">We'll get back to you within 24 business hours.</p>
                                    </div>
                                    <ContactUs />
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;