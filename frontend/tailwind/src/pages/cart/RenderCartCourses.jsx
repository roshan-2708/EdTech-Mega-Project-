import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { FaStar, FaRegStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { removeFromCart } from "../../slice/cartSlice";

const RenderCartCourses = () => {
    const { cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    return (
        <div className="flex flex-1 flex-col">
            {cart.map((course, index) => (
                <div
                    key={course._id || index}
                    className={`flex w-full flex-wrap items-start justify-between gap-6 ${index !== cart.length - 1 && "border-b border-richblack-700 pb-6"
                        } ${index !== 0 && "mt-6"}`}
                >
                    {/* LEFT Section: Thumbnail & Info */}
                    <div className="flex flex-1 flex-col gap-4 xl:flex-row">
                        <div className="relative overflow-hidden rounded-lg">
                            <img
                                src={course?.thumbnail}
                                alt={course?.courseName}
                                className="h-[148px] w-[220px] rounded-lg object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>

                        <div className="flex flex-col space-y-1">
                            <p className="text-lg font-medium text-richblack-5">
                                {course?.courseName}
                            </p>
                            <p className="text-sm text-richblack-300">
                                {course?.courseCategory?.name || "Category"}
                            </p>

                            {/* Ratings Section */}
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-5 font-semibold">4.5</span>
                                <ReactStars
                                    count={5}
                                    value={4.5}
                                    size={20}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaRegStar />}
                                    fullIcon={<FaStar />}
                                />
                                <span className="text-richblack-400">
                                    ({course?.ratingAndReview?.length || 0} Ratings)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT Section: Actions & Price */}
                    <div className="flex flex-col items-end space-y-2">
                        <button
                            onClick={() => dispatch(removeFromCart(course._id))}
                            className="flex items-center gap-x-1 rounded-md border border-richblack-700 bg-richblack-800 py-3 px-[12px] text-pink-200 transition-all duration-200 hover:bg-pink-900 hover:text-white"
                        >
                            <RiDeleteBin6Line />
                            <span>Remove</span>
                        </button>

                        <p className="text-3xl font-medium text-yellow-100">
                            ₹ {course?.price?.toLocaleString("en-IN")}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RenderCartCourses;