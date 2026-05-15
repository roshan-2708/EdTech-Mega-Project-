import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Empty cart ke liye useful hai
import { HiOutlineShoppingCart } from "react-icons/hi"; // Icon library add kar lena
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
    const { totalPrice, totalItems } = useSelector((state) => state.cart);

    return (
        <div className="mx-auto w-11/12 max-w-7xl py-12 text-white min-h-[calc(100vh-200px)]">
            {/* Page Title */}
            <h1 className="mb-10 text-4xl font-semibold tracking-tight text-richblack-5">
                My Cart
            </h1>

            <div className="flex flex-col-reverse items-start gap-x-12 gap-y-8 lg:flex-row">
                {totalPrice > 0 ? (
                    <>
                        {/* Left Side: Courses List */}
                        <div className="flex flex-1 flex-col gap-6 w-full">
                            <div className="flex items-center justify-between border-b border-richblack-700 pb-2">
                                <p className="font-medium text-richblack-400">
                                    {totalItems} Courses in Cart
                                </p>
                            </div>
                            <div className="rounded-2xl border border-richblack-700 bg-richblack-800/40 p-1 md:p-4 backdrop-blur-sm">
                                <RenderCartCourses />
                            </div>
                        </div>

                        {/* Right Side: Order Summary Card */}
                        <div className="sticky top-24 w-full lg:w-[400px]">
                            <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                <h2 className="mb-4 text-xl font-bold border-b border-richblack-700 pb-4 text-richblack-5">
                                    Order Summary
                                </h2>
                                <RenderTotalAmount />
                            </div>
                        </div>
                    </>
                ) : (
                    /* Enhanced Empty Cart State */
                    <div className="flex w-full flex-col items-center justify-center gap-6 rounded-3xl border border-richblack-700 bg-richblack-800/50 py-28 shadow-inner">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-richblack-700/50 text-richblack-200">
                            <HiOutlineShoppingCart size={48} />
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-richblack-5">Your cart is empty</p>
                            <p className="mt-2 text-richblack-400">
                                Looks like you haven’t added any courses yet.
                            </p>
                        </div>
                        <Link
                            to="/dashboard/catalog"
                            className="mt-4 rounded-full bg-yellow-50 px-8 py-3 font-bold text-richblack-900 transition-all duration-200 hover:scale-95 active:scale-105 shadow-[2px_2px_0px_rgba(255,255,255,0.18)]"
                        >
                            Explore Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}