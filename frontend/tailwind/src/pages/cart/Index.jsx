import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
    const { totalPrice, totalItems } = useSelector((state) => state.cart);

    return (
        <div className="mx-auto w-11/12 max-w-7xl py-12 text-slate-100 min-h-[calc(100vh-200px)] antialiased">

            {/* Page Header Area */}
            <div className="mb-10 flex flex-col gap-4 border-b border-slate-900 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                        My Cart
                    </h1>
                    {totalPrice > 0 && (
                        <p className="mt-1 text-xs md:text-sm text-slate-400">
                            Review the selected courses in your cart list before completing your check-out process.
                        </p>
                    )}
                </div>

                {totalPrice > 0 && (
                    <span className="w-fit rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-yellow-400 border border-slate-800 shadow-sm uppercase tracking-wider">
                        {totalItems} {totalItems === 1 ? "Course" : "Courses"} Selected
                    </span>
                )}
            </div>

            {/* Application Main Interface Grid */}
            <div>
                {totalPrice > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* Left Side: Dynamic Course List Summary */}
                        <div className="lg:col-span-2 w-full space-y-4">
                            <div className="overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/20 p-5 md:p-6 backdrop-blur-sm shadow-md">
                                <RenderCartCourses />
                            </div>
                        </div>

                        {/* Right Side: Sticky Total Checklist Order Frame */}
                        <div className="lg:sticky lg:top-24 w-full">
                            <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl backdrop-blur-sm group hover:border-slate-800 transition-colors duration-300">
                                <h2 className="mb-4 text-lg font-bold text-white tracking-tight">
                                    Order Summary
                                </h2>
                                <div className="border-t border-slate-900 pt-5">
                                    <RenderTotalAmount />
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (

                    /* High-Fidelity Interactive Empty Cart State UI */
                    <div className="flex w-full flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/10 py-20 px-4 shadow-sm">

                        {/* Shopping Cart Ring Wrapper */}
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 shadow-inner">
                            <span className="absolute inset-0 rounded-2xl bg-slate-800/40 animate-pulse" />
                            <HiOutlineShoppingCart size={26} className="relative z-10 text-slate-400" />
                        </div>

                        {/* Information Text Block */}
                        <div className="text-center max-w-sm space-y-1">
                            <h3 className="text-lg font-bold tracking-tight text-slate-100">
                                Your cart is empty
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Looks like you haven't discovered your next upgrade roadmap item yet. Let's find something matching your track!
                            </p>
                        </div>

                        {/* Yellow Themed Primary CTA Explore Catalyst Link */}
                        <Link
                            to="/dashboard/catalog"
                            className="group mt-2 inline-flex items-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 px-6 py-3 text-xs font-bold text-slate-950 shadow-md shadow-yellow-400/10 transition-all duration-200 active:scale-95"
                        >
                            Explore Global Catalog
                            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}