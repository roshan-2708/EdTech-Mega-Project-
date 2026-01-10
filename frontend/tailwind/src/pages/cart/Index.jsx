import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
    const { totalPrice, totalItems } = useSelector((state) => state.cart);

    return (
        <div className="mx-auto w-11/12 max-w-7xl py-10 text-white">
            {/* Header */}
            <div className="mb-8 border-b border-richblack-700 pb-4">
                <h1 className="text-3xl font-bold">My Cart</h1>
                <p className="mt-1 text-sm text-richblack-300">
                    {totalItems} Course{totalItems !== 1 && "s"} in Cart
                </p>
            </div>

            {totalPrice > 0 ? (
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Cart Courses */}
                    <div className="flex-1">
                        <RenderCartCourses />
                    </div>

                    {/* Price Summary */}
                    <div className="w-full lg:w-[360px]">
                        <RenderTotalAmount />
                    </div>
                </div>
            ) : (
                /* Empty Cart */
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-richblack-800 py-20">
                    <p className="text-lg text-richblack-300">
                        Your cart is empty 😔
                    </p>
                    <p className="text-sm text-richblack-400">
                        Looks like you haven’t added any courses yet.
                    </p>
                </div>
            )}
        </div>
    );
}
