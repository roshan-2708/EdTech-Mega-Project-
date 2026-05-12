import React, { useEffect, useState } from "react";
import { NavbarLinks } from "../../data/navbar-links";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import ProfileDropDown from "../core/auth/ProfileDropDown";
import { getAllCategories } from "../../services/operations/categoryAPI";

const Navbar = () => {
    const location = useLocation();

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);

    const [sublinks, setSublinks] = useState([]);
    const [mobileMenu, setMobileMenu] = useState(false);

    // Active link helper
    const isActive = (path) => location.pathname === path;

    // Fetch categories
    const fetchSublinks = async () => {
        try {
            const res = await getAllCategories();
            setSublinks(res?.data?.data || []);
        } catch (error) {
            console.error("Could not fetch categories", error);
        }
    };

    useEffect(() => {
        fetchSublinks();
    }, []);

    return (
        <div className="w-full border-b border-richblack-700 bg-richblack-900/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
            <div className="w-11/12 max-w-maxContent mx-auto h-16 flex items-center justify-between">

                {/* LOGO */}
                <Link to="/" className="flex items-center">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="w-[150px] object-contain hover:scale-105 transition duration-300"
                        loading="lazy"
                    />
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex">
                    <ul className="flex items-center gap-8 text-[15px] font-medium">

                        {NavbarLinks.map((link, idx) => (
                            <li key={idx} className="relative group">

                                {link.title === "Catalog" ? (
                                    <>
                                        {/* Catalog Button */}
                                        <div
                                            className={`flex items-center gap-1 cursor-pointer transition-all duration-200 ${location.pathname.includes("/catalog")
                                                    ? "text-yellow-25"
                                                    : "text-richblack-25"
                                                } hover:text-yellow-25`}
                                        >
                                            <span>{link.title}</span>
                                            <FaChevronDown className="text-xs mt-[2px]" />
                                        </div>

                                        {/* Dropdown */}
                                        <div className="invisible opacity-0 translate-y-3 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute left-1/2 -translate-x-1/2 top-[130%] bg-richblack-800 rounded-xl p-4 min-w-[220px] shadow-2xl border border-richblack-700 z-50">

                                            {/* Arrow */}
                                            <div className="absolute w-4 h-4 bg-richblack-800 rotate-45 top-[-8px] left-[45%] border-l border-t border-richblack-700"></div>

                                            {sublinks.length === 0 ? (
                                                <p className="text-sm text-richblack-300">
                                                    Loading...
                                                </p>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {sublinks.map((cat) => (
                                                        <Link
                                                            key={cat._id}
                                                            to={`/catalog/${encodeURIComponent(cat.name)}`}
                                                            className="px-3 py-2 rounded-lg text-richblack-25 hover:bg-richblack-700 hover:text-yellow-25 transition-all duration-200"
                                                        >
                                                            {cat.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`relative transition-all duration-200 hover:text-yellow-25 ${isActive(link.path)
                                                ? "text-yellow-25"
                                                : "text-richblack-25"
                                            }`}
                                    >
                                        {link.title}

                                        {/* Underline Animation */}
                                        <span
                                            className={`absolute left-0 -bottom-1 h-[2px] bg-yellow-25 transition-all duration-300 ${isActive(link.path)
                                                    ? "w-full"
                                                    : "w-0 group-hover:w-full"
                                                }`}
                                        ></span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-4">

                    {/* CART */}
                    {user && user.accountType !== "Instructor" && (
                        <Link
                            to="/dashboard/cart"
                            className="relative group"
                        >
                            <FaShoppingCart className="text-2xl text-richblack-25 group-hover:text-yellow-25 transition duration-200" />

                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-yellow-25 text-black min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[11px] font-bold animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* AUTH BUTTONS */}
                    {!token ? (
                        <div className="hidden md:flex items-center gap-3">

                            <Link to="/login">
                                <button className="px-5 py-2 rounded-lg border border-richblack-600 text-richblack-25 hover:border-yellow-50 hover:text-yellow-25 transition-all duration-300">
                                    Sign In
                                </button>
                            </Link>

                            <Link to="/verify-email">
                                <button className="px-5 py-2 rounded-lg bg-yellow-50 text-black font-semibold hover:scale-95 transition-all duration-300 shadow-md hover:shadow-yellow-200/20">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <ProfileDropDown />
                    )}

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className="md:hidden text-3xl text-richblack-25"
                        onClick={() => setMobileMenu(!mobileMenu)}
                    >
                        {mobileMenu ? <IoClose /> : <HiOutlineMenuAlt3 />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div
                className={`md:hidden bg-richblack-900 border-t border-richblack-700 overflow-hidden transition-all duration-300 ${mobileMenu ? "max-h-[500px] py-4" : "max-h-0"
                    }`}
            >
                <div className="w-11/12 mx-auto flex flex-col gap-4">

                    {NavbarLinks.map((link, idx) => (
                        <div key={idx}>
                            {link.title === "Catalog" ? (
                                <div className="flex flex-col gap-2">
                                    <p className="text-yellow-25 font-semibold">
                                        Catalog
                                    </p>

                                    {sublinks.map((cat) => (
                                        <Link
                                            key={cat._id}
                                            to={`/catalog/${encodeURIComponent(cat.name)}`}
                                            className="pl-4 text-richblack-200 hover:text-yellow-25"
                                            onClick={() => setMobileMenu(false)}
                                        >
                                            • {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Link
                                    to={link.path}
                                    onClick={() => setMobileMenu(false)}
                                    className={`${isActive(link.path)
                                            ? "text-yellow-25"
                                            : "text-richblack-25"
                                        } hover:text-yellow-25 transition`}
                                >
                                    {link.title}
                                </Link>
                            )}
                        </div>
                    ))}

                    {/* Mobile Auth Buttons */}
                    {!token && (
                        <div className="flex gap-3 pt-3">
                            <Link to="/login" className="w-full">
                                <button className="w-full border border-richblack-600 py-2 rounded-lg text-richblack-25">
                                    Sign In
                                </button>
                            </Link>

                            <Link to="/verify-email" className="w-full">
                                <button className="w-full bg-yellow-50 py-2 rounded-lg text-black font-semibold">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;