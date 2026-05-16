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
        <div className="w-full bg-transparent flex flex-col">
            {/* Total Description Row */}
            <div className="flex items-baseline justify-between mb-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Total Pricing
                </span>
                <p className="text-3xl font-black text-white tracking-tight">
                    ₹{totalPrice?.toLocaleString("en-IN") || "0"}
                </p>
            </div>

            {/* Premium CTA Checkout Action Control */}
            <button
                onClick={handleBuyCourse}
                className="w-full inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 py-3 text-sm font-bold text-slate-950 rounded-xl transition-all duration-200 shadow-md shadow-yellow-400/10 hover:shadow-yellow-400/20 active:scale-[0.98]"
            >
                Proceed to Checkout
            </button>

            {/* Trust Matrix Architecture Section */}
            <div className="mt-5 pt-4 border-t border-slate-900 flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    {/* Inline Pure Clean Vector Trust Shield */}
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.74c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span>Secure Gateway Processing</span>
                </div>

                {/* Micro-copy Info */}
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">
                    7-Day Refund Policy Verification
                </p>
            </div>
        </div>
    );
};

export default RenderTotalAmount;