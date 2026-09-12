import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../data/dashboard-links";
import SiderLink from "./SidebarLink";
import { VscSettingsGear, VscSignOut } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../common/ConfirmationModal";
import { logoutUser } from "../../features/auth/authAPI";
import { setUser } from "../../features/profile/profileSlice";

const SideBar = () => {
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around md:justify-center gap-2 md:gap-8 border-t border-richblack-700 bg-richblack-800/90 backdrop-blur-md px-4 py-3 text-white shadow-lg">
            
            {/* Sidebar links */}
            <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar">
                {sidebarLinks.map((link) => {
                    if (link.type && user?.accountType !== link.type) return null;
                    return (
                        <SiderLink
                            key={link.id}
                            link={link}
                            iconName={link.icon}
                        />
                    );
                })}
            </div>

            <div className="hidden md:block h-6 w-[1px] bg-richblack-700" />

            {/* Settings & Logout Container */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Settings */}
                <SiderLink
                    link={{ name: "Settings", path: "/dashboard/settings" }}
                    iconName="VscSettingsGear"
                />

                {/* Logout */}
                <button
                    onClick={() =>
                        setConfirmationModal({
                            text1: "Are you sure?",
                            text2: "You will be logged out of your account.",
                            btn1Text: "Logout",
                            btn2Text: "Cancel",
                            btn1Handler: async () => {
                                try {
                                    await logoutUser();
                                    localStorage.removeItem("token");
                                    dispatch(setUser(null));
                                    navigate("/login");
                                } catch (error) {
                                    console.error("Logout failed", error);
                                }
                            },
                            btn2Handler: () => setConfirmationModal(null),
                        })
                    }
                    className="flex items-center gap-x-1.5 px-3 py-2 text-xs sm:text-sm text-richblack-300 hover:text-pink-300 transition"
                >
                    <VscSignOut className="text-base" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>

            {confirmationModal && (
                <ConfirmationModal modalData={confirmationModal} />
            )}
        </div>
    );
};

export default SideBar;