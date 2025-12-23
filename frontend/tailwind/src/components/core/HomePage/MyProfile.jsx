import React from "react";
import { useNavigate } from "react-router-dom";
import IconButton from "../../common/IconButton";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";

const MyProfile = () => {
    const { user } = useSelector((state) => state.profile);
    const navigate = useNavigate();

    return (
        <div className="w-full space-y-6">
            {/* Top card: heading + avatar + primary info */}
            <div className="w-full rounded-xl border border-richblack-700 bg-richblack-800/60 p-6 text-white shadow-sm">
                {/* Header */}
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold">My Profile</h1>
                        <p className="text-sm text-richblack-300">
                            Manage your personal information and account details.
                        </p>
                    </div>

                    <div className="flex-1" />

                    <IconButton
                        text="Edit"
                        onClick={() => navigate("/dashboard/settings")}
                        customClasses="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-richblack-900 hover:bg-yellow-300 transition"
                    >
                        <FaEdit className="text-sm" />
                    </IconButton>
                </div>

                {/* Divider */}
                <div className="mt-5 h-px w-full bg-richblack-700" />

                {/* Profile info row */}
                <div className="mt-5 flex items-center gap-4">
                    <img
                        src={user?.image}
                        alt={`profile-${user?.firstName}`}
                        className="h-20 w-20 rounded-full object-cover border-2 border-richblack-600 shadow-sm"
                    />
                    <div className="flex flex-col gap-1">
                        <p className="text-lg font-medium">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-richblack-300">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* About card */}
            <div className="w-full rounded-xl border border-richblack-700 bg-richblack-800/60 p-6 text-white">
                <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-lg font-semibold">About</h2>
                    <span className="rounded-full bg-richblack-700 px-2 py-0.5 text-xs text-richblack-200">
                        Bio
                    </span>

                    <IconButton
                        text="Edit"
                        onClick={() => navigate("/dashboard/settings")}
                        customClasses="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-richblack-900 hover:bg-yellow-300 transition"
                    >
                        <FaEdit className="text-sm" />
                    </IconButton>
                </div>

                <div className="mt-1 text-sm leading-relaxed text-richblack-200">
                    {user?.about && user.about.trim().length > 0 ? (
                        user.about
                    ) : (
                        <span className="italic text-richblack-400">
                            {user?.additionalDetail?.about || "Write something about yourself to let others know you better."}
                        </span>
                    )}
                </div>
            </div>

            {/* Personal details card */}
            <div className="w-full rounded-xl border border-richblack-700 bg-richblack-800/60 p-6 text-white">
                {/* Header */}
                <div className="mb-4 flex items-center gap-3">
                    <h2 className="text-lg font-semibold">Personal Details</h2>

                    <IconButton
                        text="Edit"
                        onClick={() => navigate("/dashboard/settings")}
                        customClasses="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-richblack-900 hover:bg-yellow-300 transition"
                    >
                        <FaEdit className="text-sm" />
                    </IconButton>
                </div>

                {/* Details grid */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* First Name */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-richblack-400">
                            First Name
                        </p>
                        <p className="text-sm text-richblack-50">{user?.firstName || "-"}</p>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-richblack-400">
                            Last Name
                        </p>
                        <p className="text-sm text-richblack-50">{user?.lastName || "-"}</p>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-richblack-400">
                            Email
                        </p>
                        <p className="text-sm text-richblack-50 break-all">
                            {user?.email || "-"}
                        </p>
                    </div>

                    {/* Gender */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-richblack-400">
                            Gender
                        </p>
                        <p className="text-sm text-richblack-50">{user?.additionalDetail?.gender || "-"}</p>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-richblack-400">
                            Phone Number
                        </p>
                        <p className="text-sm text-richblack-50">
                            {user?.additionalDetail?.contactNumber || "-"}
                        </p>
                    </div>

                    {/* Date of birth */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-richblack-400">
                            Date of birth
                        </p>
                        <p className="text-sm text-richblack-50">
                            {user?.additionalDetail?.dateOfBirth || "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
