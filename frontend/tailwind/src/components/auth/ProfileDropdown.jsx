import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authAPI";
import { logout } from "../../features/auth/AuthSlice";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { AiOutlineCaretDown } from "react-icons/ai";

const ProfileDropDown = () => {
    const { user } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Logout
    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="relative" ref={ref}>
            {/* Profile Image & Arrow Button */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-x-1.5 group focus:outline-none"
            >
                <img
                    src={user?.image || "/default-avatar.png"}
                    alt={`profile-${user?.firstName}`}
                    className="aspect-square w-[30px] rounded-full object-cover border border-richblack-700 shadow-md group-hover:border-yellow-50 transition-all duration-200"
                    onError={(e) => {
                        e.target.src = "/default-avatar.png";
                    }}
                />
                <AiOutlineCaretDown className={`text-xs text-richblack-300 transition-transform duration-200 ${open ? "rotate-180 text-yellow-50" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-[120%] z-[1000] divide-y divide-richblack-700 overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 shadow-2xl w-48 py-1 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
                >
                    <div className="px-4 py-2.5 bg-richblack-700/30">
                        <p className="text-xs text-richblack-300 font-medium truncate">Logged in as</p>
                        <p className="text-xs font-semibold text-richblack-5 truncate">{user?.firstName || "User"}</p>
                    </div>

                    <div className="py-1">
                        <Link
                            to="/dashboard/my-profile"
                            onClick={() => setOpen(false)}
                            className="flex w-full items-center gap-x-2 py-2 px-4 text-sm text-richblack-100 hover:bg-richblack-700 hover:text-yellow-50 transition-all duration-150"
                        >
                            <VscDashboard className="text-lg text-yellow-50" />
                            Dashboard
                        </Link>
                    </div>

                    <div className="py-1">
                        <div
                            onClick={() => {
                                setOpen(false);
                                handleLogout();
                            }}
                            className="flex w-full items-center gap-x-2 py-2 px-4 text-sm text-pink-200 hover:bg-pink-200/10 hover:text-pink-100 transition-all duration-150 cursor-pointer font-medium"
                        >
                            <VscSignOut className="text-lg text-pink-200" />
                            Logout
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropDown;