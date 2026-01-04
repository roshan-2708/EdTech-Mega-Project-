import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createSubSection, updateSubSection } from "../../services/operations/subSection";
import { setCourse } from "../../slice/courseSlice";
import { CiCirclePlus } from "react-icons/ci";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { FaEye, FaTimes } from "react-icons/fa";

const SubSectionModal = ({ modalData, setModalData, add = false, view = false, edit = false }) => {
    const dispatch = useDispatch();
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);
    const [videoPreview, setVideoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const { register, handleSubmit, setValue, getValues, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
            timeDuration: "00:00",
            LectureVideo: null,
        },
    });

    const watchedVideo = watch("LectureVideo");

    // Populate form for edit/view
    useEffect(() => {
        if (view || edit) {
            reset();
            setTimeout(() => {
                setValue("title", modalData?.title || "");
                setValue("description", modalData?.description || "");
                setValue("timeDuration", modalData?.timeDuration || "00:00");
                setVideoPreview(modalData?.videoUrl || null);
            }, 100);
        } else {
            reset();
            setVideoPreview(null);
        }
    }, [modalData, setValue, reset, view, edit]);

    // Video preview
    useEffect(() => {
        if (watchedVideo && watchedVideo[0]) {
            const url = URL.createObjectURL(watchedVideo[0]);
            setVideoPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [watchedVideo]);

    const isFormUpdated = () => {
        const current = getValues();
        return (
            current.title !== modalData?.title ||
            current.description !== modalData?.description ||
            current.timeDuration !== modalData?.timeDuration
        );
    };

    const onSubmit = async (data) => {
        if (view) return; // If in view mode, do nothing

        // ✅ Validation
        if (add && !data.LectureVideo?.[0]) {
            toast.error("📹 Lecture video is required for new lectures");
            return;
        }

        if (edit && !isFormUpdated() && !data.LectureVideo?.[0]) {
            toast.error("Make changes or upload new video");
            return;
        }

        // ✅ Prepare FormData for file upload
        const formData = new FormData();
        formData.append("title", data.title?.trim() || "");
        formData.append("description", data.description?.trim() || "");
        formData.append("timeDuration", data.timeDuration || "00:00");
        formData.append("courseId", course._id);

        if (add) formData.append("sectionId", modalData); // modalData holds sectionId when adding
        else {
            formData.append("sectionId", modalData.sectionId);
            formData.append("subSectionId", modalData._id);
        }

        if (data.LectureVideo?.[0]) formData.append("video", data.LectureVideo[0]);

        try {
            setLoading(true);

            let result;
            if (add) {
                result = await createSubSection(formData, token);
            } else {
                result = await updateSubSection(formData, token);
            }

            // ✅ Use backend success & message properly
            if (result?.success) {
                dispatch(setCourse(result.data)); // Update course in Redux
                toast.success(result.message); // Show backend message
                setModalData(null); // Close modal
            } else {
                toast.error(result?.message || "Failed to save lecture");
            }
        } catch (error) {
            console.error("❌ SubSection Error:", error.response?.data || error);
            const msg = error.response?.data?.message || "Failed to save lecture";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };


    const closeModal = () => {
        setModalData(null);
        setVideoPreview(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-lg shadow-lg overflow-hidden">

                {/* Header */}
                <div className="bg-gray-800 p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {add && <CiCirclePlus className="text-green-400" />}
                            {edit && <MdOutlineModeEditOutline className="text-blue-400" />}
                            {view && <FaEye className="text-gray-400" />}
                            <span>
                                {add && "Add New Lecture"}
                                {edit && "Edit Lecture"}
                                {view && "Lecture Preview"}
                            </span>
                        </h2>
                        <button
                            onClick={closeModal}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            <FaTimes className="text-white text-lg" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lecture Title {view ? "" : <span className="text-red-500">*</span>}
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="Enter lecture title"
                            {...register("title", {
                                required: "Lecture title is required",
                                minLength: { value: 5, message: "Title must be at least 5 characters" }
                            })}
                            disabled={view || loading}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical disabled:bg-gray-100"
                            placeholder="Enter lecture description"
                            {...register("description")}
                            disabled={view || loading}
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration (MM:SS)
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="05:30"
                            {...register("timeDuration", {
                                pattern: {
                                    value: /^\d{1,2}:\d{2}$/,
                                    message: "Use MM:SS format (e.g., 05:30)"
                                }
                            })}
                            disabled={view || loading}
                        />
                        {errors.timeDuration && (
                            <p className="mt-1 text-sm text-red-600">{errors.timeDuration.message}</p>
                        )}
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Video Lecture {add && <span className="text-red-500">*</span>}
                        </label>

                        <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setValue("LectureVideo", [file]); // Manually set the file value
                                }
                            }}
                            disabled={view || loading}
                        />

                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 cursor-pointer bg-gray-50 hover:bg-blue-50 transition-colors"
                            onClick={() => !view && !loading && fileInputRef.current?.click()}
                        >
                            {videoPreview ? (
                                <div className="space-y-3">
                                    <video
                                        src={videoPreview}
                                        controls
                                        className="w-full max-h-48 mx-auto rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setValue("LectureVideo", null);
                                            setVideoPreview(null);
                                            fileInputRef.current.value = "";
                                        }}
                                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                                    >
                                        Remove video
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <CiCirclePlus className="text-3xl text-blue-500" />
                                    <p className="text-gray-700 font-medium">
                                        {add ? "Upload Lecture Video" : "Replace Video"}
                                    </p>
                                    <p className="text-xs text-gray-500">MP4, MOV, up to 500MB</p>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        {!view && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : add ? "Create Lecture" : "Update Lecture"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubSectionModal;
