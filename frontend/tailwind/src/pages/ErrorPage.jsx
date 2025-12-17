import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-richblack-900 px-4">
            <div className="text-center max-w-md">
                {/* Error Code */}
                <h1 className="text-7xl font-extrabold text-yellow-50 mb-4">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl font-semibold text-richblack-5 mb-2">
                    Page Not Found
                </h2>

                <p className="text-richblack-300 mb-6">
                    Sorry, the page you are looking for doesn’t exist or has been moved.
                </p>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-md bg-yellow-50 text-black font-semibold hover:scale-95 transition-all"
                    >
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 rounded-md bg-richblack-700 text-white font-semibold hover:bg-richblack-600 transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
