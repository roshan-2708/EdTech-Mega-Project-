import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from '../../utils/constants';
import toast from "react-hot-toast";
import { addToCart } from "../../slice/cartSlice";
import { Share2, ArrowRight, ShoppingCart, CheckCircle } from "lucide-react"; // Custom modern icons

const CourseDetailsCard = ({ course, handleBuyCourse }) => {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (!course) return null;

    const {
        thumbnail: thumbnailImage,
        price: coursePrice,
        studentEnrolled = [],
    } = course;

    const isEnrolled = user && studentEnrolled?.includes(user?._id);

    const handleAddToCart = () => {
        if (!token) {
            toast.error("Please login to add items to cart");
            navigate("/login");
            return;
        }
        if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error("Instructors can't buy or add courses to cart.");
            return;
        }
        dispatch(addToCart(course));
    };

    const handleActionClick = () => {
        if (!token) {
            toast.error("Please login to buy this course");
            navigate("/login");
            return;
        }
        if (isEnrolled) {
            navigate("/dashboard/enrolled-courses");
        } else {
            handleBuyCourse();
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className="sticky top-6 w-[360px] rounded-2xl bg-richblack-800 p-5 text-white shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-richblack-700 transition-all duration-300 hover:shadow-yellow-100/5">
            {/* Thumbnail */}
            <div className="relative overflow-hidden rounded-xl group">
                <img
                    src={thumbnailImage}
                    alt="Course thumbnail"
                    className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/60 to-transparent" />
            </div>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-richblack-5">₹{coursePrice}</span>
                <span className="text-sm text-richblack-400 line-through">₹{coursePrice * 3}</span>
                <span className="text-xs font-semibold text-caribbeangreen-200 bg-caribbeangreen-200/10 px-2 py-0.5 rounded">
                    66% OFF
                </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col gap-3">
                <button
                    onClick={handleActionClick}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-yellow-50 px-4 py-3 font-semibold text-richblack-900 transition-all duration-200 hover:bg-yellow-100 active:scale-[0.98]"
                >
                    {isEnrolled ? "Go to Course" : "Buy Now"}
                    <ArrowRight className="h-4 w-4" />
                </button>

                {!isEnrolled && (
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center justify-center gap-2 w-full rounded-xl border border-richblack-600 bg-richblack-700/40 px-4 py-3 font-semibold text-richblack-5 transition-all duration-200 hover:bg-richblack-700 active:scale-[0.98]"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                    </button>
                )}
            </div>

            <p className="mt-4 text-center text-xs text-richblack-400">
                🛡️ 30-Day Money-Back Guarantee
            </p>

            <hr className="my-5 border-richblack-700" />

            {/* Inclusions */}
            <div>
                <p className="mb-3 font-medium text-richblack-5 text-sm">This course includes:</p>
                <ul className="flex flex-col gap-2.5 text-xs text-richblack-200">
                    {course?.instructions?.length > 0 ? (
                        course.instructions.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 line-clamp-2">
                                <CheckCircle className="h-4 w-4 text-caribbeangreen-200 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))
                    ) : (
                        <li className="text-richblack-400 italic">No specific requirements mentioned</li>
                    )}
                </ul>
            </div>

            {/* Share Button */}
            <button
                onClick={handleShare}
                className="mx-auto mt-5 flex items-center gap-2 text-sm font-medium text-yellow-50 transition-all duration-200 hover:text-yellow-100 hover:underline"
            >
                <Share2 className="h-4 w-4" />
                Share Course
            </button>
        </div>
    );
};

export default CourseDetailsCard;