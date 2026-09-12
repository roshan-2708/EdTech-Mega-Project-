import React from "react";

const Design = ({ icon, title, description, bgColor }) => {
    return (
        <div className="flex items-start gap-4 relative">

            {/* Icon Circle */}
            <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${bgColor}`}
            >
                <span className="text-xl">{icon}</span>
            </div>

            {/* Texts */}
            <div>
                <h2 className="text-lg text-gray-700 font-semibold">{title}</h2>
                <p className="text-gray-600 text-sm">{description}</p>
            </div>
        </div>
    );
};

export default Design;
