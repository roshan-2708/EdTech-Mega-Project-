import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiLock, FiTrash2, FiCheck } from "react-icons/fi";
import { BiErrorCircle } from "react-icons/bi";

import { apiConnector } from "../services/apiConnecter";
import { setUser } from "../slice/profileSlice";
import { profileEndpoints } from "../services/apis";
import { changePassword, deleteAccount } from "../services/operations/authAPI";

const { PROFILE_IMAGE, PROFILE_UPDATE } = profileEndpoints;

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.profile);

    const fileInputRef = useRef(null);

    /* ================= STATES ================= */
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        about: "",
    });

    /* ================= POPULATE FORM ================= */
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

    /* ================= COMMON HANDLERS ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image")) {
            alert("Only image files allowed");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Image must be under 2MB");
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    /* ================= IMAGE UPLOAD ================= */
    const handleUploadImage = async () => {
        if (!imageFile) return alert("Select an image first");

        setLoadingImage(true);
        const fd = new FormData();
        fd.append("profilePicture", imageFile);

        try {
            const res = await apiConnector("PUT", PROFILE_IMAGE, fd);
            const updatedImage = res?.data?.data?.image || res?.data?.image;

            const updatedUser = { ...user, image: updatedImage };
            dispatch(setUser(updatedUser));
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setImageFile(null);
            setPreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            alert("Profile picture updated successfully");
        } catch (err) {
            alert(err.response?.data?.message || "Image upload failed");
        } finally {
            setLoadingImage(false);
        }
    };

    /* ================= PROFILE UPDATE ================= */
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoadingProfile(true);

        try {
            const res = await apiConnector("PUT", PROFILE_UPDATE, formData);

            dispatch(setUser(res.data.data));
            localStorage.setItem("user", JSON.stringify(res.data.data));

            alert("Profile updated successfully");
        } catch (err) {
            alert(err.response?.data?.message || "Profile update failed");
        } finally {
            setLoadingProfile(false);
        }
    };

    /* ================= PASSWORD UPDATE ================= */
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword || !newPassword) {
            setPasswordMessage("All fields are required");
            return;
        }

        setLoadingPassword(true);
        setPasswordMessage("");

        try {
            const res = await changePassword(oldPassword, newPassword);
            if (res.data.success) {
                setPasswordMessage("✅ Password changed successfully");
                setOldPassword("");
                setNewPassword("");
            }
        } catch {
            setPasswordMessage("Password update failed");
        } finally {
            setLoadingPassword(false);
        }
    };

    /* ================= DELETE ACCOUNT ================= */
    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account?")) return;

        try {
            const res = await deleteAccount();
            if (res.data.success) {
                localStorage.clear();
                dispatch(setUser(null));
                navigate("/login");
            }
        } catch {
            alert("Delete account failed");
        }
    };

    /* ================= JSX ================= */
    return (
        <main className="min-h-screen bg-richblack-900 flex justify-center px-4 py-10">
            <div className="w-full max-w-4xl space-y-6 text-richblack-5">

                {/* Page Header */}
                <header className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-richblack-400 font-semibold">Preferences</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-richblack-5">
                        Account Settings
                    </h1>
                    <p className="text-sm text-richblack-300">
                        Manage your profile, change your password, and control your account.
                    </p>
                </header>

                {/* 1. Profile Picture Section */}
                <div className="rounded-2xl border border-richblack-700 bg-richblack-800/60 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-richblack-5">Profile Picture</h2>
                        <span className="text-xs bg-richblack-700 px-2.5 py-0.5 rounded text-richblack-300 border border-richblack-600">Public</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        <img
                            src={preview || user?.image || "/default-avatar.png"}
                            alt={`profile-${user?.firstName || "user"}`}
                            className="h-20 w-20 rounded-full object-cover border-2 border-richblack-600 shadow-md"
                        />
                        <div className="space-y-2 flex-1">
                            <p className="text-xs text-richblack-300">
                                JPG, PNG or JPEG. Maximum size 2MB.
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleSelectFile}
                                    className="flex items-center gap-1.5 px-4 py-2 text-xs bg-richblack-700 text-richblack-5 rounded-xl font-medium hover:bg-richblack-600 transition border border-richblack-600"
                                >
                                    <FiUpload className="text-sm" /> Select New
                                </button>
                                {imageFile && (
                                    <button
                                        type="button"
                                        onClick={handleUploadImage}
                                        disabled={loadingImage}
                                        className="px-4 py-2 text-xs bg-yellow-400 text-richblack-900 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
                                    >
                                        {loadingImage ? "Uploading..." : "Upload Image"}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setPreview(null); }}
                                    className="text-xs text-richblack-400 hover:text-richblack-200 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>

                {/* 2. Edit Profile Information Section */}
                <div className="rounded-2xl border border-richblack-700 bg-richblack-800/60 p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-richblack-5 mb-5">Edit Profile Information</h2>

                    <form onSubmit={handleUpdateProfile} className="space-y-4" noValidate>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="firstName" className="text-xs font-medium text-richblack-300 uppercase tracking-wide">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-xl bg-richblack-900/80 text-richblack-5 border border-richblack-700 focus:outline-none focus:border-richblack-500 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="lastName" className="text-xs font-medium text-richblack-300 uppercase tracking-wide">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-xl bg-richblack-900/80 text-richblack-5 border border-richblack-700 focus:outline-none focus:border-richblack-500 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="dateOfBirth" className="text-xs font-medium text-richblack-300 uppercase tracking-wide">
                                    Date of birth
                                </label>
                                <input
                                    id="dateOfBirth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-xl bg-richblack-900/80 text-richblack-5 border border-richblack-700 focus:outline-none focus:border-richblack-500 text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="gender" className="text-xs font-medium text-richblack-300 uppercase tracking-wide">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-xl bg-richblack-900/80 text-richblack-5 border border-richblack-700 focus:outline-none focus:border-richblack-500 text-sm"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="contactNumber" className="text-xs font-medium text-richblack-300 uppercase tracking-wide">
                                Contact number
                            </label>
                            <input
                                id="contactNumber"
                                type="tel"
                                name="contactNumber"
                                placeholder="+1 555 234 5678"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl bg-richblack-900/80 text-richblack-5 border border-richblack-700 focus:outline-none focus:border-richblack-500 text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <label htmlFor="about" className="text-xs font-medium text-richblack-300 uppercase tracking-wide">
                                    About / Bio
                                </label>
                                <span className="text-xs text-richblack-500">{formData.about?.length || 0} / 250</span>
                            </div>
                            <textarea
                                id="about"
                                name="about"
                                rows={3}
                                maxLength={250}
                                placeholder="Write something about yourself..."
                                value={formData.about}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl bg-richblack-900/80 text-richblack-5 border border-richblack-700 focus:outline-none focus:border-richblack-500 text-sm resize-none"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loadingProfile}
                                className="flex items-center gap-2 px-5 py-2.5 text-xs bg-yellow-400 text-richblack-900 rounded-xl font-semibold hover:bg-yellow-300 transition disabled:opacity-50 shadow"
                            >
                                <FiCheck className="text-sm" /> {loadingProfile ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 3 & 4. Security & Password and Delete Account Side-by-Side Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* Security & Password Section */}
                    <div className="rounded-2xl border border-richblack-700 bg-richblack-800/60 p-6 shadow-sm space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FiLock className="text-yellow-400" />
                                <h2 className="text-base font-semibold text-richblack-5">Security & Password</h2>
                            </div>
                            <p className="text-xs text-richblack-300">
                                Use a strong, unique password to safeguard your account.
                            </p>
                        </div>

                        {passwordMessage && (
                            <p className="text-xs text-pink-300 bg-pink-500/10 p-2.5 rounded-lg border border-pink-500/20">{passwordMessage}</p>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
                            <div className="space-y-1">
                                <label htmlFor="oldPassword" className="text-xs font-medium text-richblack-300 uppercase tracking-wide">
                                    Old password
                                </label>
                                <input
                                    id="oldPassword"
                                    type="password"
                                    placeholder="Enter old password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-richblack-900/80 text-richblack-5 border border-richblack-700 focus:outline-none focus:border-richblack-500 text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="newPassword" className="text-xs font-medium text-richblack-300 uppercase tracking-wide">
                                    New password
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-richblack-900/80 text-richblack-5 border border-richblack-700 focus:outline-none focus:border-richblack-500 text-sm"
                                />
                                <p className="text-[11px] text-richblack-500 pt-1">Min. 8 characters recommended.</p>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loadingPassword}
                                    className="w-full bg-richblack-700 hover:bg-richblack-600 text-richblack-5 py-2.5 rounded-xl text-xs font-semibold transition border border-richblack-600 disabled:opacity-50 shadow"
                                >
                                    {loadingPassword ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Delete Account Danger Zone */}
                    <div className="rounded-2xl border border-pink-500/40 bg-richblack-800/60 p-6 space-y-6 h-full flex flex-col justify-between shadow-sm">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5 text-pink-400">
                                <FiTrash2 className="text-xl" />
                                <h2 className="text-base font-semibold">Delete Account</h2>
                            </div>
                            <p className="text-xs text-richblack-300 leading-relaxed">
                                Deleting your account is permanent. You will permanently forfeit your course enrollments, completion badges, and verified progress history.
                            </p>

                            {/* Added info box to fill empty space nicely */}
                            <div className="rounded-xl bg-pink-500/5 border border-pink-500/20 p-3.5 space-y-1.5">
                                <p className="text-xs font-medium text-pink-300">⚠️ Important Warning</p>
                                <p className="text-[11px] text-richblack-400">
                                    Once deleted, your profile cannot be recovered. Make sure to download any certificates before proceeding.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-pink-500/10 border border-pink-500/50 text-xs font-semibold text-pink-300 hover:bg-pink-500/20 transition shadow"
                            >
                                <BiErrorCircle className="text-base" /> Permanently Delete Account
                            </button>
                            <p className="text-[11px] text-richblack-500 text-center mt-2">This action cannot be undone.</p>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
};

export default Settings;