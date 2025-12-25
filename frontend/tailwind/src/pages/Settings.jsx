import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";

import { apiConnector } from "../services/apiConnecter";
import { setUser } from "../slice/profileSlice";
import { authEndpoints } from "../services/apis";
import { changePassword, deleteAccount } from "../services/operations/authAPI";

const { PROFILE_IMAGE, PROFILE_UPDATE } = authEndpoints;

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);

    const fileInputRef = useRef(null);

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        about: "",
    });

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    const tokenPass = localStorage.getItem("token");

    // Populate form when user data loads
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                dateOfBirth: user.additionalDetail?.dateOfBirth || "",
                gender: user.additionalDetail?.gender || "",
                contactNumber: user.additionalDetail?.contactNumber || "",
                about: user.additionalDetail?.about || "",
            });
        }
    }, [user]);

    // Handle profile form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // File select
    const handleSelectFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image")) {
            alert("Only image files are allowed");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Image must be less than 2MB");
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    // Upload profile image
    const handleUploadImage = async () => {
        if (!imageFile) {
            alert("Please select an image first");
            return;
        }

        setLoadingImage(true);

        const formDataImage = new FormData();
        formDataImage.append("profilePicture", imageFile);

        try {
            const response = await apiConnector(
                "PUT",
                PROFILE_IMAGE,
                formDataImage,
                {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            );

            const updatedUser = {
                ...user,
                image: response.data.data.image,
            };

            dispatch(setUser(updatedUser));
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setPreview(null);
            setImageFile(null);
            alert("Profile picture updated successfully!");
        } catch (err) {
            console.error("Image upload failed", err);
            alert("Failed to upload image");
        } finally {
            setLoadingImage(false);
        }
    };

    // Update profile details
    const handleUpdateProfile = async (e) => {
        e?.preventDefault?.();
        setLoadingProfile(true);

        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                contactNumber: formData.contactNumber,
                about: formData.about,
            };

            await apiConnector("PUT", PROFILE_UPDATE, payload, {
                Authorization: `Bearer ${token}`,
            });

            const updatedUser = {
                ...user,
                firstName: formData.firstName,
                lastName: formData.lastName,
                additionalDetail: {
                    ...user?.additionalDetail,
                    dateOfBirth: formData.dateOfBirth,
                    gender: formData.gender,
                    contactNumber: formData.contactNumber,
                    about: formData.about,
                },
            };

            dispatch(setUser(updatedUser));
            localStorage.setItem("user", JSON.stringify(updatedUser));

            alert("Profile details updated successfully!");
        } catch (err) {
            console.error("Profile update failed", err);
            alert("Failed to update profile details");
        } finally {
            setLoadingProfile(false);
        }
    };

    // Update password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            setPasswordMessage("All fields are required.");
            return;
        }

        setLoadingPassword(true);
        setPasswordMessage("");

        try {
            const res = await changePassword(tokenPass, oldPassword, newPassword);

            if (res.success) {
                setPasswordMessage("✅ Password changed successfully");
                setOldPassword("");
                setNewPassword("");
            } else {
                setPasswordMessage(res.message || "Password update failed");
            }
        } catch (error) {
            console.error(error);
            setPasswordMessage("Something went wrong");
        } finally {
            setLoadingPassword(false);
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure? This action cannot be undone."
        );

        if (!confirmed) return;

        const res = await deleteAccount(tokenPass);
        if (res.success) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/signup");
        } else {
            alert(res.message || "Failed to delete account");
        }
    };

    return (
        <main className="min-h-screen bg-transparent flex justify-center px-4 py-10">
            <div className="w-full max-w-5xl space-y-8">
                {/* Page Header */}
                <header className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold text-richblack-5">
                        Account Settings
                    </h1>
                    <p className="text-sm text-richblack-300">
                        Manage your profile, change your password, and control your account.
                    </p>
                </header>

                {/* Main Grid */}
                <div className="grid gap-8 lg:grid-cols-[2fr,1.4fr]">
                    {/* Left: Profile */}
                    <section className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 space-y-8">
                        <h2 className="text-lg font-semibold text-richblack-5 mb-2">
                            Edit Profile
                        </h2>

                        {/* Profile Image Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <img
                                    src={preview || user?.image || "/default-avatar.png"}
                                    alt={`profile-${user?.firstName || "user"}`}
                                    className="h-24 w-24 rounded-full object-cover border-2 border-richblack-600 shadow-md"
                                />
                                <button
                                    type="button"
                                    onClick={handleSelectFile}
                                    className="absolute -bottom-1 -right-1 bg-yellow-50 p-1 rounded-full border border-richblack-700 cursor-pointer hover:bg-yellow-100 transition"
                                    aria-label="Change profile picture"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-richblack-900"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536M9 11l6-6M3 21h18"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium text-richblack-5">
                                    Profile picture
                                </p>
                                <p className="text-xs text-richblack-300">
                                    JPG, PNG or JPEG. Max size 2MB.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleUploadImage}
                                    disabled={loadingImage}
                                    className="px-4 py-1.5 text-sm bg-yellow-50 text-richblack-900 rounded-md font-medium hover:bg-yellow-100 transition disabled:opacity-50 mt-2"
                                >
                                    {loadingImage ? "Uploading..." : "Upload Image"}
                                </button>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Profile Form */}
                        <form
                            onSubmit={handleUpdateProfile}
                            className="mt-6 space-y-4"
                            noValidate
                        >
                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="flex flex-col flex-1">
                                    <label
                                        htmlFor="firstName"
                                        className="text-sm text-richblack-200 mb-1"
                                    >
                                        First name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="p-2 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                                    />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label
                                        htmlFor="lastName"
                                        className="text-sm text-richblack-200 mb-1"
                                    >
                                        Last name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="p-2 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="flex flex-col flex-1">
                                    <label
                                        htmlFor="dateOfBirth"
                                        className="text-sm text-richblack-200 mb-1"
                                    >
                                        Date of birth
                                    </label>
                                    <input
                                        id="dateOfBirth"
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="p-2 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                                    />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label
                                        htmlFor="gender"
                                        className="text-sm text-richblack-200 mb-1"
                                    >
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="p-2 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 md:flex-row">
                                <div className="flex flex-col flex-1">
                                    <label
                                        htmlFor="contactNumber"
                                        className="text-sm text-richblack-200 mb-1"
                                    >
                                        Contact number
                                    </label>
                                    <input
                                        id="contactNumber"
                                        type="tel"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className="p-2 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                                    />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label
                                        htmlFor="about"
                                        className="text-sm text-richblack-200 mb-1"
                                    >
                                        About
                                    </label>
                                    <textarea
                                        id="about"
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        rows={3}
                                        className="p-2 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loadingProfile}
                                    className="px-4 py-2 text-sm bg-yellow-50 text-richblack-900 rounded-md font-medium hover:bg-yellow-100 transition disabled:opacity-50"
                                >
                                    {loadingProfile ? "Updating..." : "Save changes"}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* Right: Password + Danger */}
                    <section className="space-y-6">
                        {/* Password Section */}
                        <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-richblack-5 mb-2">
                                Change password
                            </h2>
                            <p className="text-xs text-richblack-300 mb-4">
                                Use a strong, unique password for better security.
                            </p>

                            {passwordMessage && (
                                <p className="mb-3 text-sm text-pink-300">{passwordMessage}</p>
                            )}

                            <form
                                onSubmit={handlePasswordSubmit}
                                className="space-y-4"
                                noValidate
                            >
                                <div className="flex flex-col">
                                    <label
                                        htmlFor="oldPassword"
                                        className="text-sm text-richblack-200 mb-1"
                                    >
                                        Old password
                                    </label>
                                    <input
                                        id="oldPassword"
                                        type="password"
                                        placeholder="Enter old password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full p-2 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label
                                        htmlFor="newPassword"
                                        className="text-sm text-richblack-200 mb-1"
                                    >
                                        New password
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full p-2 rounded-md bg-richblack-700 text-richblack-5 border border-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loadingPassword}
                                    className="w-full bg-yellow-50 hover:bg-yellow-100 text-white py-2 rounded-md text-sm font-medium transition disabled:opacity-50"
                                >
                                    {loadingPassword ? "Updating..." : "Change password"}
                                </button>
                            </form>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-richblack-800 border border-pink-500/60 rounded-xl p-6 flex gap-4 items-start">
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                className="mt-1 text-pink-400 hover:text-pink-300"
                                aria-label="Delete account"
                            >
                                <MdDeleteForever size={28} />
                            </button>
                            <div>
                                <h2 className="text-base font-semibold text-pink-300 mb-1">
                                    Delete account
                                </h2>
                                <p className="text-xs text-richblack-300">
                                    Deleting your account is permanent and will remove all data,
                                    including any paid course access, associated with it.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    className="mt-3 inline-flex items-center px-3 py-1.5 rounded-md border border-pink-500 text-xs text-pink-200 hover:bg-pink-500/10 transition"
                                >
                                    Permanently delete account
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Settings;
