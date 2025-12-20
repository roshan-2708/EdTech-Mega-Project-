import React from "react";
import ContactUs from "./ContactUs";

const ContatctForm = () => {
    return (
        <section className="">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Content */}
                <div className="text-white space-y-4">
                    <h1 className="text-4xl font-bold">
                        Get In Touch
                    </h1>

                    <p className="text-gray-400 text-lg">
                        We'd love to hear from you. Please fill out this form and our team
                        will get back to you as soon as possible.
                    </p>

                    <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            📧 <span>support@example.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            📞 <span>+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            📍 <span>India</span>
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <div>
                    <ContactUs />
                </div>

            </div>
        </section>
    );
};

export default ContatctForm;
