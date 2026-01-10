import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStar from "../common/RatingStars";
import GetAvgRating from "../../utils/avgRating";

const Course_Card = ({ course, Height = "h-[100px]" }) => {
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    const reviews = course?.ratingAndReview || course?.reviews || [];

    useEffect(() => {
        setAvgReviewCount(GetAvgRating(reviews));
    }, [reviews]);

    return (
        <Link to={`/course/${course?._id}`} className="block">
            <div
                className="
          group
          w-[260px]
          flex
          flex-col
          overflow-hidden
          rounded-xl
          bg-richblack-800
          shadow-md
          transition-all
          duration-300
          hover:shadow-xl
          hover:-translate-y-1
        "
            >
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                    <img
                        src={course?.thumbnail || course?.thumbnailUrl}
                        alt={course?.courseName || course?.title}
                        className={`${Height} w-full object-cover transition-transform duration-300 group-hover:scale-105`}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                    {/* Title */}
                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-richblack-5">
                        {course?.courseName || course?.title}
                    </p>

                    {/* Instructor */}
                    <p className="text-xs text-richblack-300">
                        {course?.instructor?.firstName
                            ? `${course.instructor.firstName} ${course.instructor.lastName}`
                            : "Instructor"}
                    </p>

                    {/* Rating */}
                    <div className="mt-1 flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-yellow-400">
                            {avgReviewCount}
                        </span>

                        <RatingStar Review_Count={avgReviewCount} />

                        <span className="text-richblack-400">
                            ({reviews.length})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mt-2 text-sm font-bold text-richblack-5">
                        ₹ {course?.price || "Free"}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Course_Card;
