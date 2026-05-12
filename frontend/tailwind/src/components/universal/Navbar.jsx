import React, { useEffect, useState } from "react";
import { NavbarLinks } from "../../data/navbar-links";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart, AiOutlineDown } from "react-icons/ai";
import ProfileDropDown from "../core/auth/ProfileDropDown";
import { getAllCategories } from "../../services/operations/categoryAPI";
import toast from "react-hot-toast";

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const location = useLocation();
    const [sublinks, setSublinks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSublinks = async () => {
        setLoading(true);
        try {
            const res = await getAllCategories();
            setSublinks(res?.data?.data || []);
        } catch (error) {
            console.error("Could not fetch categories", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSublinks();
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`fixed top-0 z-50 w-full h-16 flex items-center justify-center border-b-[1px] border-richblack-700 bg-richblack-900/80 backdrop-blur-md transition-all duration-300`}>
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                
                {/* LOGO */}
                <Link to="/">
                    <img src={Logo} alt="Logo" width={160} height={32} loading="lazy" />
                </Link>

                {/* NAV LINKS */}
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div className="group relative flex cursor-pointer items-center gap-1 hover:text-yellow-25 transition-all duration-200">
                                        <p>{link.title}</p>
                                        <AiOutlineDown />
                                        
                                        {/* Mega Dropdown */}
                                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-xl bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                                            <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                            
                                            {loading ? (
                                                <p className="text-center py-4">Loading...</p>
                                            ) : sublinks.length ? (
                                                sublinks.map((subLink, i) => (
                                                    <Link
                                                        key={cat._id}
                                                        to={`/catalog/${encodeURIComponent(cat.name)}`}
                                                        className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50 transition-all duration-200"
                                                    >
                                                        <p className="font-semibold">{subLink.name}</p>
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="text-center">No Categories Found</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link to={link?.path}>
                                        <p className={`${isActive(link?.path) ? "text-yellow-25 underline underline-offset-8 decoration-2" : "text-richblack-25"} hover:text-yellow-50 transition-all duration-200`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* RIGHT SIDE (Login/Signup/Cart/Profile) */}
                <div className="hidden items-center gap-x-4 md:flex">
                    {user && user?.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className="relative group">
                            <AiOutlineShoppingCart className="text-2xl text-richblack-100 group-hover:text-yellow-25 transition-all" />
                            {totalItems > 0 && (
                                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100 animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {!token && (
                        <>
                            <Link to="/login">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:scale-95 transition-all">
                                    Log in
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:scale-95 transition-all">
                                    Sign up
                                </button>
                            </Link>
                        </>
                    )}

                    {token && <ProfileDropDown />}
                </div>
            </div>
        </div>
    );
};

export default Navbar;