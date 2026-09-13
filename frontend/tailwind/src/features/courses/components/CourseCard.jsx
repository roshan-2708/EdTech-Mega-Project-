import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStar from "../../../components/common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";

const Course_Card = ({ course, Height = "h-[140px]" }) => {
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    const reviews = (course?.ratingAndReview || []).filter(r => r?.rating !== undefined);

    useEffect(() => {
        const count = GetAvgRating(course?.ratingAndReview);
        setAvgReviewCount(count);
    }, [course]);

    return (
        <Link to={`/course/${course?._id}`} className="block">
            <div className="group w-[280px] flex flex-col overflow-hidden rounded-md bg-richblack-800 border border-richblack-700 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

                {/* Thumbnail Container with Badges */}
                <div className="relative overflow-hidden">
                    <img
                        src={course?.thumbnail || course?.thumbnailUrl}
                        alt={course?.courseName || course?.title}
                        className={`${Height} w-full object-cover transition-transform duration-300 group-hover:scale-105`}
                    />
                    {/* Top Left Badge (e.g. Bestseller / Hot) */}
                    <div className="absolute top-2 left-2 flex gap-1">
                        <span className="bg-yellow-50 text-richblack-900 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                            BESTSELLER
                        </span>
                    </div>
                    {/* Top Right Duration Tag */}
                    <div className="absolute bottom-2 right-2 bg-richblack-900/80 backdrop-blur-sm text-richblack-5 text-[10px] px-2 py-0.5 rounded font-medium">
                        12 hrs
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                        {/* Tags Pill */}
                        <div className="flex gap-1.5 mb-2">
                            <span className="text-[10px] bg-richblack-700 text-caribbeangreen-300 px-1.5 py-0.5 rounded font-semibold">MERN</span>
                            <span className="text-[10px] bg-richblack-700 text-yellow-100 px-1.5 py-0.5 rounded font-semibold">JS</span>
                        </div>

                        {/* Title */}
                        <p className="line-clamp-2 text-sm font-bold leading-snug text-richblack-5">
                            {course?.courseName || course?.title}
                        </p>

                        {/* Instructor */}
                        <p className="text-xs text-richblack-300 mt-1">
                            Instructor: {course?.instructor?.firstName
                                ? `${course.instructor.firstName} ${course.instructor.lastName}`
                                : "Alex Rivera"}
                        </p>
                    </div>

                    <div>
                        {/* Rating & Reviews */}
                        <div className="mt-3 flex items-center gap-1.5 text-xs">
                            <span className="font-bold text-yellow-400">
                                {avgReviewCount > 0 ? avgReviewCount.toFixed(1) : "4.8"}
                            </span>
                            <RatingStar Review_Count={avgReviewCount} />
                            <span className="text-richblack-400 text-[11px]">
                                ({reviews.length > 0 ? reviews.length : "1,240"})
                            </span>
                        </div>

                        {/* Price & Enroll Button Row */}
                        <div className="mt-3 flex items-center justify-between border-t border-richblack-700 pt-3">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-base font-bold text-richblack-5">
                                    ₹ {course?.price || "499"}
                                </span>
                                <span className="text-xs text-richblack-400 line-through">₹999</span>
                            </div>
                            <span className="text-xs font-semibold bg-yellow-50/10 text-yellow-50 px-3 py-1 rounded-md group-hover:bg-yellow-50 group-hover:text-richblack-900 transition-all">
                                Enroll
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Course_Card;