import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {

    const { totalPrice, totalItems } = useSelector((state) => state.cart);

    return (
        <div>
            <h1>My List</h1>
            <p>{totalItems} Courses in Cart</p>

            {totalPrice > 0 ? (
                <div>
                    <RenderCartCourses />
                    <RenderTotalAmount />
                </div>
            ) : (
                <p>Your Cart is empty.</p>
            )}
        </div>
    );
}
