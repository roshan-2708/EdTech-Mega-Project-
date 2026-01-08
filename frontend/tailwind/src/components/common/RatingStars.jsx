import React, { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating = 0, size = 20 }) => {
    const [starCount, setStarCount] = useState({
        full: 0,
        half: 0,
        empty: 5,
    });

    useEffect(() => {
        // Clamp rating between 0 and 5
        const safeRating = Math.max(0, Math.min(5, rating));

        const full = Math.floor(safeRating);
        const half = safeRating % 1 !== 0 ? 1 : 0;
        const empty = 5 - full - half;

        setStarCount({ full, half, empty });
    }, [rating]);

    return (
        <div className="flex gap-1 text-yellow-400">
            {[...Array(starCount.full)].map((_, i) => (
                <FaStar key={`full-${i}`} size={size} />
            ))}

            {[...Array(starCount.half)].map((_, i) => (
                <FaStarHalfAlt key={`half-${i}`} size={size} />
            ))}

            {[...Array(starCount.empty)].map((_, i) => (
                <FaRegStar key={`empty-${i}`} size={size} />
            ))}
        </div>
    );
};

export default RatingStars;
