import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; 
import { HiOutlineShoppingCart } from "react-icons/hi"; 
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
    const { totalPrice, totalItems } = useSelector((state) => state.cart);

    return (
        <div className="mx-auto w-11/12 max-w-7xl py-12  text-white min-h-[calc(100vh-200px)]">
            {/* Page Header */}
            <div className="mb-10 flex flex-col gap-2 border-b border-richblack-800 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-richblack-5 to-richblack-200 bg-clip-text text-transparent sm:text-4xl">
                        My Cart
                    </h1>
                    {totalPrice > 0 && (
                        <p className="mt-1 text-sm text-richblack-400">
                            Review the items in your cart before finishing your order.
                        </p>
                    )}
                </div>
                {totalPrice > 0 && (
                    <span className="w-fit rounded-full bg-richblack-800 px-4 py-1.5 text-xs font-semibold text-richblack-100 border border-richblack-700 shadow-md">
                        {totalItems} {totalItems === 1 ? "Course" : "Courses"} Enrolled
                    </span>
                )}
            </div>

            {/* Layout Wrapper */}
            <div className="flex flex-col-reverse items-start gap-x-15 gap-y-12 gap-6 lg:flex-row">
                {totalPrice > 0 ? (
                    <>
                        {/* Left Content Area: Course Stack */}
                        <div className="flex flex-1 flex-col gap-6 w-full">
                            <div className="overflow-hidden rounded-2xl border border-richblack-800 bg-gradient-to-b from-richblack-900/40 to-richblack-950/40 p-4 md:p-6 backdrop-blur-md shadow-xl">
                                <RenderCartCourses />
                            </div>
                        </div>

                        {/* Right Content Area: Order Checkout Panel */}
                        <div className="sticky top-28 w-full lg:w-[420px] flex-shrink-0">
                            <div className="rounded-2xl border border-richblack-800 bg-gradient-to-b from-richblack-900 to-richblack-950 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-richblack-700">
                                <h2 className="mb-5 text-xl font-bold text-richblack-5 tracking-wide">
                                    Order Summary
                                </h2>
                                <div className="border-t border-richblack-800/80 pt-5">
                                    <RenderTotalAmount />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* High-Fidelity Interactive Empty State */
                    <div className="flex w-full flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-richblack-800 bg-gradient-to-b from-richblack-900/20 to-richblack-950/20 py-24 px-4 shadow-2xl">
                        {/* Animated Shopping Cart Core */}
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-richblack-900 border border-richblack-800 text-richblack-300 shadow-inner">
                            <div className="absolute inset-0 rounded-full bg-richblack-700/10 animate-ping opacity-75"></div>
                            <HiOutlineShoppingCart size={40} className="relative z-10" />
                        </div>
                        
                        {/* Text Content */}
                        <div className="text-center max-w-sm space-y-2">
                            <p className="text-2xl font-bold tracking-tight text-richblack-5">
                                Your cart is completely empty
                            </p>
                            <p className="text-sm text-richblack-400 leading-relaxed">
                                Looks like you haven’t discovered your next favorite skill yet. Let's find something incredible!
                            </p>
                        </div>

                        {/* Action CTA Button */}
                        <Link
                            to="/dashboard/catalog"
                            className="group mt-2 inline-flex items-center gap-2 rounded-xl bg-yellow-50 px-8 py-3.5 text-sm font-bold text-richblack-900 shadow-[2px_2px_0px_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-yellow-100 hover:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] active:translate-y-0 active:scale-[0.98]"
                        >
                            Explore Global Catalog
                            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}