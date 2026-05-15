import React, { useEffect, useState } from "react";
import {
    TiStarFullOutline,
    TiStarHalfOutline,
    TiStarOutline,
} from "react-icons/ti";

function RatingStars({ Review_Count, Star_Size }) {
    const [starCount, setStarCount] = useState({
        full: 0,
        half: 0,
        empty: 5,
    });

    useEffect(() => {
        const count = Number(Review_Count) || 0; 
        const fullStars = Math.floor(count);      
        const halfStars = count % 1 >= 0.5 ? 1 : 0; 
        const emptyStars = 5 - fullStars - halfStars; 

        setStarCount({
            full: fullStars,
            half: halfStars,
            empty: emptyStars,
        });
    }, [Review_Count]);

    return (
        <div className="flex gap-1 text-yellow-100">
            {[...Array(starCount.full)].map((_, i) => (
                <TiStarFullOutline key={`full-${i}`} size={Star_Size || 20} />
            ))}
            {[...Array(starCount.half)].map((_, i) => (
                <TiStarHalfOutline key={`half-${i}`} size={Star_Size || 20} />
            ))}
            {[...Array(starCount.empty)].map((_, i) => (
                <TiStarOutline key={`empty-${i}`} size={Star_Size || 20} />
            ))}
        </div>
    );
}

export default RatingStars;
