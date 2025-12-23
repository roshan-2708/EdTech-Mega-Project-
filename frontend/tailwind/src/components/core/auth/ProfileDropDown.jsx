import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../services/operations/authAPI";
import { logout } from "../../../slice/AuthSlice";

const ProfileDropDown = () => {
    const { user } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log("USER FROM REDUX:", user);

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
            {/* Profile Image Button */}
            <button onClick={() => setOpen((prev) => !prev)}>
                <img
                    src={user?.image || "/default-avatar.png"}
                    alt="Profile"
                    className="w-7 h-7 rounded-full object-cover border"
                    onError={(e) => {
                        e.target.src = "/default-avatar.png";
                    }}
                />
            </button>

            {/* Dropdown */}
            {open && (

                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                    <ul className="py-2 text-sm text-gray-700">
                        <Link to={'/dashboard'}>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                Dashboard
                            </li></Link>

                        <li className="border-t my-1"></li>

                        <li
                            className="px-4 py-2 text-red-500 hover:bg-red-50 cursor-pointer"
                            onClick={() => {
                                setOpen(false);
                                handleLogout(); // ✅ CALL THE FUNCTION
                            }}
                        >
                            Logout
                        </li>

                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileDropDown;
