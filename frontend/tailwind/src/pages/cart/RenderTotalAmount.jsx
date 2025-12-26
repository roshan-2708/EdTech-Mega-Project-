import React from "react";
import { useSelector } from "react-redux";

const RenderTotalAmount = () => {
    const { totalPrice, cart } = useSelector((state) => state.cart);

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        console.log("Bought these courses:", courses);
    };

    return (
        <div>
            <p>Total :</p>
            <p>Rs {totalPrice}</p>

            <button onClick={handleBuyCourse}>
                Buy now
            </button>
        </div>
    );
};

export default RenderTotalAmount;
