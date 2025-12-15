import React from "react";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
    const { heading, description, level, lessionNumber } = cardData;

    const isActive = currentCard === heading;

    return (
        <div
            onClick={() => setCurrentCard(heading)}
            className={`
        w-full sm:w-[260px] md:w-[280px] lg:w-[300px]
        p-5 rounded-xl cursor-pointer transition-all duration-300
        ${isActive
                    ? "bg-white text-richblack-700 border-2 border-yellow-5 shadow-lg scale-105"
                    : "bg-richblack-700 border border-richblack-600 hover:scale-105"
                }
    `}
        >
            {/* Heading */}
            <h2 className="text-base md:text-lg font-semibold mb-2">
                {heading}
            </h2>

            {/* Description */}
            <p className="text-richblack-300 text-xs md:text-sm mb-4 leading-relaxed">
                {description}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center text-[11px] md:text-xs text-richblack-300 mt-4">
                <span>{level}</span>
                <span>{lessionNumber} Lessons</span>
            </div>
        </div>

    );
};

export default CourseCard;
