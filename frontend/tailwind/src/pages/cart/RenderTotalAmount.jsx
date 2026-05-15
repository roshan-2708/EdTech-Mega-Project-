import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyCourse } from "../../services/operations/studentFeatureApi";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa"; // Trust icon

const RenderTotalAmount = () => {
    const { totalPrice, cart } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        buyCourse(token, courses, user, navigate, dispatch);
    };

    return (
        <div className="min-w-[280px] rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] sticky top-24">
            {/* Label */}
            <p className="mb-1 text-sm font-medium text-richblack-300">Total Price:</p>

            {/* Price Display */}
            <p className="mb-6 text-3xl font-bold text-yellow-100">
                ₹ {totalPrice.toLocaleString("en-IN")}
            </p>

            {/* Buy Now Button */}
            <button
                onClick={handleBuyCourse}
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-yellow-50 py-3 font-bold text-richblack-900 transition-all duration-300 hover:scale-[0.98] active:scale-95 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)] hover:shadow-none"
            >
                <span className="relative z-10">Buy Now</span>
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-500 group-hover:translate-x-full" />
            </button>

            {/* Trust Factor/Info */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-richblack-400">
                <FaShieldAlt className="text-caribbeangreen-200" />
                <span>Secure Checkout • 7-Day Money Back</span>
            </div>

            {/* Micro-copy */}
            <p className="mt-2 text-center text-[10px] uppercase tracking-widest text-richblack-500">
                100% Authentic Content
            </p>
        </div>
    );
};

export default RenderTotalAmount;