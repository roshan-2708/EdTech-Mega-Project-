import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sidebarLinks } from "../../../data/dashboard-links";
import SiderLink from "./SiderLink";
import { VscSettingsGear, VscSignOut } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ConfirmationModal";
import { logoutUser } from "../../../services/operations/authAPI";
import { setUser } from "../../../slice/profileSlice";

const SideBar = () => {
    const { user } = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);

    return (
        <div className="flex min-w-[222px] flex-col border-r border-richblack-700
                    h-[calc(100vh-3.5rem)] py-10 text-white">

            {/* Sidebar links */}
            <div className="flex flex-col">
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

            <div className="mx-auto my-6 h-[1px] w-10/12 bg-richblack-700" />

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
                                await logoutUser();      // API call
                                localStorage.removeItem("token");
                                dispatch(setUser(null)); // Clear Redux user
                                navigate("/login");
                            } catch (error) {
                                console.error("Logout failed", error);
                            }
                        },

                        btn2Handler: () => setConfirmationModal(null),
                    })
                }
                className="mt-4 flex items-center gap-x-2 px-6 py-2 text-sm text-richblack-300"
            >
                <VscSignOut />
                <span>Logout</span>
            </button>

            {confirmationModal && (
                <ConfirmationModal modalData={confirmationModal} />
            )}
        </div>
    );
};

export default SideBar;
