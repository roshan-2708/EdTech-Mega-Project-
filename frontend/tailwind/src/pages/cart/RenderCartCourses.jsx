import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaRegStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from "../../slice/cartSlice";

const RenderCartCourses = () => {
    const { cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    // Helper to calculate average rating dynamically if available
    const getAvgRating = (ratingArr) => {
        if (!ratingArr || ratingArr.length === 0) return 0;
        const totalReviewCount = ratingArr.reduce((acc, curr) => acc + curr.rating, 0);
        return Math.round((totalReviewCount / ratingArr.length) * 10) / 10;
    };

    return (
        <div className="flex flex-1 flex-col divide-y divide-richblack-800">
            {cart.map((course, index) => {
                const avgRating = getAvgRating(course?.ratingAndReview) || 4.5; // fallback to 4.5 for visual demo

                return (
                    <div
                        key={course._id || index}
                        className={`flex flex-col gap-6 py-6 lg:flex-row lg:items-center justify-between ${
                            index === 0 ? "pt-2" : ""
                        } ${index === cart.length - 1 ? "pb-2" : ""}`}
                    >
                        {/* LEFT SECTION: Thumbnail & Info */}
                        <div className="flex flex-col gap-5 sm:flex-row flex-1 min-w-0 items-start w-full">
                            {/* Thumbnail */}
                            <div className="w-full sm:w-44 aspect-video relative overflow-hidden rounded-xl bg-richblack-900 border border-richblack-800 flex-shrink-0 group">
                                <img
                                    src={course?.thumbnail}
                                    alt={course?.courseName}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            {/* Course Metadata */}
                            <div className="flex flex-col flex-1 min-w-0 space-y-2 w-full">
                                <div className="space-y-1.5">
                                    <h3 className="text-lg font-bold text-richblack-5 leading-snug hover:text-yellow-50 transition-colors duration-200 cursor-pointer line-clamp-2 pr-2">
                                        {course?.courseName}
                                    </h3>
                                    <span className="inline-block text-xs font-semibold text-richblack-300 bg-richblack-900 border border-richblack-800 px-2.5 py-0.5 rounded-md">
                                        {course?.courseCategory?.name || "General Development"}
                                    </span>
                                </div>

                                {/* Strict Single Line Ratings Module */}
                                <div className="flex items-center gap-2 pt-1 flex-nowrap overflow-x-auto no-scrollbar whitespace-nowrap w-full">
                                    <span className="text-sm font-bold text-yellow-5 flex-shrink-0">{avgRating}</span>
                                    <div className="flex items-center pointer-events-none flex-shrink-0">
                                        <ReactStars
                                            count={5}
                                            value={avgRating}
                                            size={18}
                                            edit={false}
                                            activeColor="#ffd700"
                                            emptyIcon={<FaRegStar />}
                                            fullIcon={<FaStar />}
                                        />
                                    </div>
                                    <span className="text-xs text-richblack-400 font-medium flex-shrink-0">
                                        ({course?.ratingAndReview?.length || 0} Reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SECTION: Price Top & Button Bottom Always */}
                        <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end flex-shrink-0 w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-richblack-800/60 lg:ml-6">
                            {/* Price (Top on desktop, left on mobile) */}
                            <div className="lg:text-right">
                                <p className="text-2xl font-extrabold text-yellow-50 tracking-tight">
                                    ₹{course?.price?.toLocaleString("en-IN")}
                                </p>
                            </div>

                            {/* Remove Action (Bottom on desktop, right on mobile) */}
                            <button
                                onClick={() => dispatch(removeFromCart(course._id))}
                                className="group flex items-center gap-1.5 rounded-lg border border-richblack-800 bg-richblack-900/40 py-2 px-3 text-xs font-semibold text-pink-200 transition-all duration-300 hover:bg-pink-600/10 hover:border-pink-500/30 hover:text-pink-100 active:scale-95"
                            >
                                <RiDeleteBin6Line className="text-sm transition-transform group-hover:scale-110" />
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RenderCartCourses;