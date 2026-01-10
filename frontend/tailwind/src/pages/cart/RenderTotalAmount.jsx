import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyCourse } from "../../services/operations/studentFeatureApi";
import { useNavigate } from "react-router-dom";

const RenderTotalAmount = () => {
    const { totalPrice, cart } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        console.log("Bought these courses:", courses);
        buyCourse(token, courses, user, navigate, dispatch);
    };

    return (
        <div className="rounded-xl bg-richblack-800 p-6 text-white">
            <p className="mb-2 text-sm text-richblack-300">Total Amount</p>
            <p className="mb-4 text-2xl font-bold">₹ {totalPrice}</p>

            <button
                onClick={handleBuyCourse}
                className="w-full rounded-lg bg-yellow-100 py-3 font-semibold text-richblack-900 hover:bg-yellow-200"
            >
                Buy now
            </button>
        </div>
    );

};

export default RenderTotalAmount;
