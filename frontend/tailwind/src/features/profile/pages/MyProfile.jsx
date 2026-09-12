import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import IconButton from "../../../components/common/IconButton";

import {
  FaEdit,
  FaFire,
  FaGraduationCap,
  FaCheckCircle,
  FaChartLine,
  FaLock,
  FaShieldAlt,
} from "react-icons/fa";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate("/dashboard/settings");
  };

  const aboutText =
    user?.about?.trim() ||
    user?.additionalDetail?.about ||
    "Write something about yourself to let others know you better.";

  return (
    <div className="min-h-screen bg-richblack-900 flex justify-center px-4 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-4">

        <section className="rounded-xl border border-richblack-700 bg-richblack-800/60 p-4 shadow-sm sm:p-5">

          <div className="flex items-center justify-between gap-4">

            {/* Profile information */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">

              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={
                    user?.image ||
                    "https://api.dicebear.com/5.x/initials/svg?seed=User"
                  }
                  alt={`profile-${user?.firstName || "user"}`}
                  className="h-14 w-14 rounded-full border-2 border-richblack-600 object-cover sm:h-16 sm:w-16"
                />

                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-richblack-800 bg-green-500" />
              </div>

              {/* Name + email */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-base font-semibold text-richblack-5 sm:text-lg">
                    {user?.firstName || "User"}{" "}
                    {user?.lastName || ""}
                  </h1>

                  <span className="rounded-full bg-richblack-700 px-2 py-0.5 text-[9px] font-medium text-richblack-200">
                    Verified Student
                  </span>
                </div>

                <p className="mt-0.5 truncate text-xs text-richblack-300 sm:text-sm">
                  {user?.email || "No email available"}
                </p>
              </div>
            </div>

            {/* Edit */}
            <IconButton
              text="Edit"
              onClick={goToSettings}
              customClasses="
                shrink-0
                flex items-center gap-2
                rounded-lg
                border border-richblack-600
                bg-richblack-700
                px-3 py-2
                text-xs font-medium text-richblack-5
                transition
                hover:bg-richblack-600
              "
            >
              <FaEdit className="text-xs" />
            </IconButton>
          </div>

          <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-lg border border-richblack-700 bg-richblack-900">

            {/* Enrolled */}
            <div className="border-r border-richblack-700 px-3 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <FaGraduationCap className="text-xs text-richblack-300" />
                <p className="text-base font-semibold text-richblack-5 sm:text-lg">
                  04
                </p>
              </div>

              <p className="mt-0.5 text-[9px] uppercase tracking-wide text-richblack-400 sm:text-[10px]">
                Enrolled
              </p>
            </div>

            {/* Completed */}
            <div className="border-r border-richblack-700 px-3 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <FaCheckCircle className="text-xs text-richblack-300" />
                <p className="text-base font-semibold text-richblack-5 sm:text-lg">
                  03
                </p>
              </div>

              <p className="mt-0.5 text-[9px] uppercase tracking-wide text-richblack-400 sm:text-[10px]">
                Completed
              </p>
            </div>

            {/* Score */}
            <div className="px-3 py-3 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <FaChartLine className="text-xs text-richblack-300" />
                <p className="text-base font-semibold text-richblack-5 sm:text-lg">
                  88%
                </p>
              </div>

              <p className="mt-0.5 text-[9px] uppercase tracking-wide text-richblack-400 sm:text-[10px]">
                Avg Score
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between rounded-xl border border-richblack-700 bg-richblack-800/60 px-4 py-3 sm:px-5">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-richblack-700">
              <FaFire className="text-sm text-yellow-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-richblack-5 sm:text-sm">
                  14 Days Streak
                </p>

                <span className="rounded-full bg-richblack-700 px-1.5 py-0.5 text-[8px] text-richblack-300">
                  Active
                </span>
              </div>

              <p className="mt-0.5 text-[10px] text-richblack-400 sm:text-xs">
                Top 5% among engineering peers
              </p>
            </div>
          </div>

          {/* Streak bars */}
          <div className="hidden items-end gap-1 sm:flex">
            <span className="h-3 w-1 rounded-full bg-richblack-500" />
            <span className="h-5 w-1 rounded-full bg-richblack-400" />
            <span className="h-4 w-1 rounded-full bg-richblack-500" />
            <span className="h-7 w-1 rounded-full bg-yellow-400" />
            <span className="h-5 w-1 rounded-full bg-yellow-400" />
            <span className="h-8 w-1 rounded-full bg-yellow-400" />
            <span className="h-6 w-1 rounded-full bg-yellow-400" />
          </div>
        </section>
        <section className="rounded-xl border border-richblack-700 bg-richblack-800/60 p-4 sm:p-5">

          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-richblack-5 sm:text-base">
              About Me
            </h2>

            <span className="rounded-full bg-richblack-700 px-2 py-0.5 text-[9px] text-richblack-300">
              Bio
            </span>

            <IconButton
              text="Edit"
              onClick={goToSettings}
              customClasses="
                ml-auto
                flex items-center gap-1.5
                rounded-md
                bg-richblack-700
                px-2.5 py-1.5
                text-[10px] text-richblack-200
                transition
                hover:bg-richblack-600
              "
            >
              <FaEdit className="text-[9px]" />
            </IconButton>
          </div>

          <p className="text-xs leading-relaxed text-richblack-200 sm:text-sm">
            {aboutText}
          </p>

          {/* Skills / tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {["Full-Stack", "Next.js", "TypeScript", "Python"].map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-richblack-700 px-2 py-1 text-[9px] text-richblack-300 sm:text-[10px]"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </section>

        <section className="rounded-xl border border-richblack-700 bg-richblack-800/60 p-4 sm:p-5">

          <div className="mb-4 flex items-center">
            <h2 className="text-sm font-semibold text-richblack-5 sm:text-base">
              Personal Details
            </h2>

            <IconButton
              text="Edit"
              onClick={goToSettings}
              customClasses="
                ml-auto
                flex items-center gap-1.5
                rounded-md
                bg-richblack-700
                px-2.5 py-1.5
                text-[10px] text-richblack-200
                transition
                hover:bg-richblack-600
              "
            >
              <FaEdit className="text-[9px]" />
            </IconButton>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <ProfileField
              label="First Name"
              value={user?.firstName}
            />

            <ProfileField
              label="Last Name"
              value={user?.lastName}
            />

            <ProfileField
              label="Email Address"
              value={user?.email}
              fullWidth
            />

            <ProfileField
              label="Phone Number"
              value={user?.additionalDetail?.contactNumber}
            />

            <ProfileField
              label="Gender"
              value={user?.additionalDetail?.gender}
            />

            <ProfileField
              label="Date of Birth"
              value={user?.additionalDetail?.dateOfBirth}
            />
          </div>
        </section>
        <section className="rounded-xl border border-richblack-700 bg-richblack-800/60 p-4 sm:p-5">

          <div className="mb-3 flex items-center gap-2">
            <FaLock className="text-xs text-richblack-400" />

            <h2 className="text-sm font-semibold text-richblack-5 sm:text-base">
              Account Credentials
            </h2>

            <span className="ml-auto flex items-center gap-1 rounded-full bg-richblack-700 px-2 py-1 text-[9px] text-richblack-300">
              <FaShieldAlt className="text-[8px]" />
              2FA Active
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-richblack-700 bg-richblack-900 px-3 py-3">

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-richblack-800">
                <FaLock className="text-xs text-richblack-400" />
              </div>

              <div>
                <p className="text-xs font-medium text-richblack-200">
                  Password
                </p>

                <p className="mt-0.5 text-[9px] text-richblack-500">
                  Last modified 32 days ago
                </p>
              </div>
            </div>

            <button
              onClick={goToSettings}
              className="
                rounded-md
                bg-richblack-700
                px-3 py-1.5
                text-[9px] font-medium
                text-richblack-200
                transition
                hover:bg-richblack-600
              "
            >
              Update
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value, fullWidth = false }) => {
  return (
    <div className={`${fullWidth ? "sm:col-span-2" : ""}`}>
      <p className="mb-1 text-[9px] font-medium uppercase tracking-wide text-richblack-400">
        {label}
      </p>

      <div className="flex min-h-[38px] items-center rounded-md border border-richblack-700 bg-richblack-900 px-3 py-2">
        <p className="break-all text-xs text-richblack-100">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

export default MyProfile;