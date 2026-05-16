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
        <div className="flex flex-col divide-y divide-slate-900 w-full">
            {cart.map((course, index) => {
                const avgRating = getAvgRating?.(course?.ratingAndReview) || 4.5;

                return (
                    <div
                        key={course._id || index}
                        className={`flex flex-col gap-6 py-5 lg:flex-row lg:items-center justify-between transition-all duration-150 ${
                            index === 0 ? "pt-1" : ""
                        } ${index === cart.length - 1 ? "pb-1" : ""}`}
                    >
                        {/* LEFT SECTION: Main Course Metadata & Graphics Card */}
                        <div className="flex flex-col gap-4 sm:flex-row flex-1 min-w-0 items-start w-full">
                            {/* Thumbnail Fixed Dimensions Frame */}
                            <div className="w-full sm:w-40 aspect-video relative overflow-hidden rounded-xl bg-slate-950 border border-slate-900 flex-shrink-0 group">
                                <img
                                    src={course?.thumbnail}
                                    alt={course?.courseName}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            {/* Core Typography Properties */}
                            <div className="flex flex-col flex-1 min-w-0 space-y-2 w-full">
                                <div className="space-y-1">
                                    <h3 className="text-base md:text-lg font-bold text-slate-100 hover:text-yellow-400 transition-colors line-clamp-1 leading-snug">
                                        {course?.courseName}
                                    </h3>
                                    <span className="inline-block text-[10px] font-bold text-slate-400 bg-slate-950 border border-slate-900 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                                        {course?.courseCategory?.name || "General Development"}
                                    </span>
                                </div>

                                {/* Precision Uniform Single-Line Ratings Grid */}
                                <div className="flex items-center gap-2 pt-0.5 flex-nowrap overflow-x-auto no-scrollbar whitespace-nowrap w-full">
                                    <span className="text-sm font-bold text-yellow-400 flex-shrink-0">
                                        {avgRating.toFixed(1)}
                                    </span>
                                    <div className="flex items-center pointer-events-none flex-shrink-0 opacity-90 scale-95 origin-left">
                                        <ReactStars
                                            count={5}
                                            value={avgRating}
                                            size={16}
                                            edit={false}
                                            activeColor="#eab308"
                                            emptyIcon={<FaRegStar />}
                                            fullIcon={<FaStar />}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium flex-shrink-0">
                                        ({course?.ratingAndReview?.length || 0} Reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SECTION: Dynamic Financial Block & Action Matrix */}
                        <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end flex-shrink-0 w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-900 lg:ml-6">
                            {/* Indian Standardised Currency Layout */}
                            <div className="lg:text-right">
                                <p className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                                    ₹{course?.price?.toLocaleString("en-IN") || "0"}
                                </p>
                            </div>

                            {/* Destructive Control Button */}
                            <button
                                onClick={() => dispatch(removeFromCart(course._id))}
                                className="group flex items-center gap-1.5 rounded-xl border border-slate-900 bg-slate-950/40 px-3.5 py-2 text-xs font-bold text-red-400 transition-all duration-200 hover:bg-red-500/5 hover:border-red-500/20 active:scale-95"
                            >
                                <RiDeleteBin6Line className="text-sm transition-transform group-hover:scale-105" />
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