import React, { useEffect, useState } from "react";
import { NavbarLinks } from "../../data/navbar-links";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import ProfileDropDown from "../core/auth/ProfileDropDown";
import { getAllCategories } from "../../services/operations/categoryAPI";
const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);

    const [sublinks, setSublinks] = useState([]);

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
        <div className="w-full h-16 border-b border-richblack-700 bg-richblack-900 flex items-center">
            <div className="w-11/12 max-w-maxContent mx-auto flex items-center justify-between">

                {/* LOGO */}
                <Link to="/">
                    <img
                        src={Logo}
                        alt="Logo"
                        className="w-[160px] h-[32px] object-contain"
                        loading="lazy"
                    />
                </Link>

                {/* NAV LINKS */}
                <nav className="hidden md:block">
                    <ul className="flex items-center gap-6 text-richblack-25 font-medium">
                        {NavbarLinks.map((link, idx) => (
                            <li key={idx} className="relative group">
                                {link.title === "Catalog" ? (
                                    <div className="cursor-pointer text-richblack-5 group-hover:text-yellow-25">
                                        Catalog ▾
                                        <div className="absolute left-0 hidden group-hover:block bg-richblack-800 px-4 py-3 rounded-lg shadow-lg z-20 w-48">
                                            {sublinks.length === 0 ? (
                                                <p className="text-sm text-richblack-200">
                                                    Loading...
                                                </p>
                                            ) : (
                                                sublinks.map((cat) => (
                                                    <Link
                                                        key={cat._id}
                                                        // to={`/catalog/${cat.name}`}
                                                        to={`/catalog/${encodeURIComponent(cat.name)}`}
                                                        className="block py-1 hover:text-yellow-25 transition"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to={link.path}
                                        className={`${isActive(link.path)
                                            ? "text-yellow-25"
                                            : "text-richblack-5"
                                            } hover:text-yellow-25 transition`}
                                    >
                                        {link.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* RIGHT SIDE */}
                <div className="flex gap-x-4 items-center">

                    {/* CART */}
                    {user && user.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className="relative">
                            <FaShoppingCart className="text-richblack-5 text-xl" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-yellow-25 text-black rounded-full px-2 text-xs font-bold">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* AUTH BUTTONS */}
                    {!token ? (
                        <div className="flex gap-3">
                            <Link to="/login">
                                <button className="border border-yellow-50 px-4 py-1 rounded-md hover:bg-yellow-50 hover:text-black transition">
                                    Sign in
                                </button>
                            </Link>
                            <Link to="/verify-email">
                                <button className="border border-yellow-50 px-4 py-1 rounded-md hover:bg-yellow-50 hover:text-black transition">
                                    Sign up
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>

                            <ProfileDropDown />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
