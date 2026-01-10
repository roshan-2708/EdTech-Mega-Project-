import React from "react";
import { useDispatch, useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { removeFromCart } from "../../slice/cartSlice";

const RenderCartCourses = () => {

    const { cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col gap-6">
            {cart.map((course, index) => (
                <div
                    key={course._id || index}
                    className="flex flex-col justify-between gap-4 rounded-xl bg-richblack-800 p-4 text-white shadow-md md:flex-row"
                >
                    {/* LEFT: Thumbnail + Info */}
                    <div className="flex gap-4">
                        <img
                            src={course?.thumbnail}
                            alt="course"
                            className="h-[100px] w-[160px] rounded-lg object-cover"
                        />

                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-semibold">
                                {course?.courseName}
                            </p>

                            <p className="text-sm text-richblack-300">
                                {course?.courseCategory}
                            </p>

                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-sm font-medium text-yellow-100">4.0</span>

                                <StarRatings
                                    count={5}
                                    size={18}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaStarHalf />}
                                    fullIcon={<FaStar />}
                                />

                                <span className="text-xs text-richblack-300">
                                    ({course?.ratingAndReview?.length || 0} ratings)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Price + Remove */}
                    <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end">
                        <button
                            onClick={() => dispatch(removeFromCart(course._id))}
                            className="flex items-center gap-2 rounded-md bg-richblack-700 px-3 py-2 text-sm text-pink-200 hover:bg-pink-900 hover:text-white"
                        >
                            <MdDelete />
                            Remove
                        </button>

                        <p className="text-xl font-bold text-yellow-100">
                            ₹ {course?.price}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );

};

export default RenderCartCourses;
