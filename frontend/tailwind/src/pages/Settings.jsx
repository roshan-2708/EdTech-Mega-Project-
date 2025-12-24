import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiConnector } from "../services/apiConnecter";
import { setUser } from "../slice/profileSlice";
import { authEndpoints } from "../services/apis";

const { PROFILE_IMAGE, PROFILE_UPDATE } = authEndpoints;

const Settings = () => {
    const dispatch = useDispatch();
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

    // Handle input change
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // File select
    const handleSelectFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
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
            const response = await apiConnector("PUT", PROFILE_IMAGE, formDataImage, {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            });

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
    const handleUpdateProfile = async () => {
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

    return (
        <div className="bg-richblack-800 rounded-xl p-6 border max-w-3xl mx-auto">
            <h1 className="text-xl font-semibold text-richblack-5 mb-6">
                Edit Profile
            </h1>

            {/* Profile Image Section */}
            <div className="flex items-center gap-6 border-richblack-700 mb-6">
                <div className="relative">
                    <img
                        src={preview || user?.image || "/default-avatar.png"}
                        alt={`profile-${user?.firstName || "user"}`}
                        className="h-24 w-24 rounded-full object-cover border-2 border-richblack-600 shadow-md"
                    />
                    <div
                        className="absolute -bottom-1 -right-1 bg-yellow-50 p-1 rounded-full border border-richblack-700 cursor-pointer"
                        onClick={handleSelectFile}
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
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-richblack-5">
                        Profile Picture
                    </p>
                    <p className="text-xs text-richblack-300">
                        JPG, PNG or JPEG (Max 2MB)
                    </p>
                    <button
                        onClick={handleUploadImage}
                        disabled={loadingImage}
                        className="px-4 py-1.5 text-sm bg-yellow-50 text-richblack-900 rounded-md font-medium hover:bg-yellow-100 transition-all disabled:opacity-50 mt-2"
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

            {/* Profile Information Section */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="p-2 rounded-md bg-richblack-700 text-richblack-5"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="p-2 rounded-md bg-richblack-700 text-richblack-5"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="p-2 rounded-md bg-richblack-700 text-richblack-5"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="p-2 rounded-md bg-richblack-700 text-richblack-5"
                        >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col flex-1">
                        <label>Contact Number</label>
                        <input
                            type="number"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className="p-2 rounded-md bg-richblack-700 text-richblack-5"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label>About</label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            className="p-2 rounded-md bg-richblack-700 text-richblack-5"
                            rows={3}
                        />
                    </div>
                </div>

                <button
                    onClick={handleUpdateProfile}
                    disabled={loadingProfile}
                    className="px-4 py-2 w-auto text-sm bg-yellow-50 text-richblack-900 rounded-md font-medium hover:bg-yellow-100 transition-all disabled:opacity-50 mt-4"
                >
                    {loadingProfile ? "Updating..." : "Update Profile"}
                </button>
            </div>
        </div>
    );
};

export default Settings;
