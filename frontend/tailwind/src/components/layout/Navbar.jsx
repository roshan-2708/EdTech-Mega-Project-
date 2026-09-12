import React, { useEffect, useState } from "react";
import { NavbarLinks } from "../../data/navbar-links";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo/Logo-Full-Light.png";
import { useSelector } from "react-redux";
import { FaShoppingCart, FaChevronDown } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import ProfileDropDown from "../auth/ProfileDropdown";
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
                    <ul className="flex items-center gap-7 text-[14px] font-medium tracking-wide">
                        {NavbarLinks.map((link, idx) => (
                            <li key={idx} className="relative group flex items-center">
                                {link.title === "Catalog" ? (
                                    <>
                                        {/* Catalog Button Pill */}
                                        <button
                                            type="button"
                                            className={`group flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-sm font-medium transition-all duration-200 cursor-pointer ${location.pathname.includes("/catalog")
                                                    ? "text-yellow-50 bg-richblack-800 border border-richblack-700 font-semibold shadow-inner"
                                                    : "text-richblack-100 hover:text-yellow-50 hover:bg-richblack-800/80"
                                                }`}
                                        >
                                            <span>{link.title}</span>
                                            <FaChevronDown className="text-[10px] text-richblack-400 transition-transform duration-300 group-hover:rotate-180 group-hover:text-yellow-50" />
                                        </button>

                                        {/* Invisible Hover Bridge (prevents dropdown closing when moving mouse) */}
                                        <div className="absolute left-0 top-full h-3 w-full" />

                                        {/* Dropdown Menu */}
                                        <div className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] bg-richblack-900/95 backdrop-blur-md rounded-sm p-3 min-w-[240px] shadow-2xl border border-richblack-700/80 z-50">

                                            {/* Pointing Arrow */}
                                            <div className="absolute w-3 h-3 bg-richblack-900 rotate-45 -top-1.5 left-1/2 -translate-x-1/2 border-l border-t border-richblack-700/80" />

                                            {sublinks.length === 0 ? (
                                                <p className="text-xs text-richblack-400 py-2 text-center font-normal">
                                                    Loading categories...
                                                </p>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    {sublinks.map((cat) => (
                                                        <Link
                                                            key={cat._id}
                                                            to={`/catalog/${encodeURIComponent(cat.name)}`}
                                                            className="px-3 py-2 rounded-sm text-xs font-medium text-richblack-100 hover:bg-richblack-800 hover:text-yellow-50 transition-all duration-150 flex items-center justify-between group/item"
                                                        >
                                                            <span>{cat.name}</span>
                                                            <span className="text-[10px] text-richblack-500 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                →
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`relative py-1 transition-colors duration-200 ${isActive(link.path)
                                                ? "text-yellow-50 font-semibold"
                                                : "text-richblack-100 hover:text-yellow-50"
                                            }`}
                                    >
                                        <span>{link.title}</span>

                                        {/* Subtle Pill Underline Indicator */}
                                        <span
                                            className={`absolute left-0 -bottom-0.5 h-[2px] rounded-sm bg-yellow-50 transition-all duration-200 ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                                                }`}
                                        />
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
                                <span className="absolute -top-2 -right-2 bg-yellow-25 text-black min-w-[20px] h-[20px] flex items-center justify-center rounded-sm text-[11px] font-bold animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* AUTH BUTTONS */}
                    {!token ? (
                        <div className="hidden md:flex items-center gap-3">

                            <Link to="/login">
                                <button className="px-5 py-2 rounded-sm border border-richblack-600 text-richblack-25 hover:border-yellow-50 hover:text-yellow-25 transition-all duration-300">
                                    Sign In
                                </button>
                            </Link>

                            <Link to="/verify-email">
                                <button className="px-5 py-2 rounded-sm bg-yellow-50 text-black font-semibold hover:scale-95 transition-all duration-300 shadow-md hover:shadow-yellow-200/20">
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
                                <button className="w-full border border-richblack-600 py-2 rounded-sm text-richblack-25">
                                    Sign In
                                </button>
                            </Link>

                            <Link to="/verify-email" className="w-full">
                                <button className="w-full bg-yellow-50 py-2 rounded-sm text-black font-semibold">
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