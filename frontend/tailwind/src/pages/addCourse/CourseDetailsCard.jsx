import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from '../../utils/constants'
import toast from "react-hot-toast";
import { addToCart } from "../../slice/cartSlice";
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

    const isEnrolled =
        user && studentEnrolled?.includes(user?._id);

    const handleAddToCart = () => {
        if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error("You are an instructor")
            return;
        }
        if (token) {
            dispatch(addToCart(course));
            return;
        }

    };
    const handleShare = () => {

    }

    return (
        <div className="sticky top-6 rounded-xl bg-richblack-800 p-6 text-white shadow-lg">
            <img
                src={thumbnailImage}
                alt="Course thumbnail"
                className="mb-4 h-[200px] w-full rounded-lg object-cover"
            />

            <p className="mb-4 text-3xl font-bold">₹ {coursePrice}</p>

            <div className="flex flex-col gap-3">
                <button
                    onClick={
                        isEnrolled
                            ? () => navigate("/dashboard/enrolled-courses")
                            : handleBuyCourse
                    }
                    className="rounded-lg bg-yellow-100 px-4 py-3 font-semibold text-richblack-900 hover:bg-yellow-200"
                >
                    {isEnrolled ? "Go to course" : "Buy now"}
                </button>

                {!isEnrolled && (
                    <button
                        onClick={handleAddToCart}
                        className="rounded-lg border border-richblack-600 px-4 py-3 font-semibold hover:bg-richblack-700"
                    >
                        Add to cart
                    </button>
                )}
            </div>

            <p className="mt-4 text-center text-sm text-richblack-300">
                30-day money-back guarantee
            </p>

            <div className="mt-6">
                <p className="mb-2 font-semibold">This course includes:</p>
                <ul className="flex flex-col gap-2 text-sm text-richblack-300">
                    {course?.instructions?.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                    ))}
                </ul>
            </div>

            <button
                onClick={handleShare}
                className="mx-auto mt-6 flex items-center gap-2 text-yellow-100 hover:underline"
            >
                Share
            </button>
        </div>
    );

};

export default CourseDetailsCard;
