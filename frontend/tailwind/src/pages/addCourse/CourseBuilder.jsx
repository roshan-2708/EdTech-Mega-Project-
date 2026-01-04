import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { CgCalendarNext } from "react-icons/cg";
import { IoAddCircleSharp } from "react-icons/io5";

import IconBtn from "../../components/common/IconButton";
import { setStep, setCourse } from "../../slice/courseSlice";
import { createSection, updateSection, deleteSection } from "../../services/operations/sectionApi";
import NestedView from "./NestedView";

const CourseBuilder = () => {
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            sectionName: "",
        },
    });

    const dispatch = useDispatch();
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);

    const [editSectionId, setEditSectionId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Debug: Check course data
    useEffect(() => {
        console.log("🔍 CourseBuilder course:", {
            id: course?._id,
            name: course?.courseName,
            sections: course?.courseContent?.length || 0,
        });

        if (!course?._id) {
            toast.error("⚠️ Course ID missing! Complete Step 1 first.");
        }
    }, [course]);

    const cancelEdit = () => {
        setEditSectionId(null);
        reset({ sectionName: "" });
    };

    const onSubmit = async (data) => {
        const sectionName = data.sectionName?.trim();

        if (!sectionName) {
            toast.error("Section name cannot be empty");
            return;
        }

        if (!course?._id) {
            toast.error("Course ID missing. Go back to Step 1.");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                sectionName,
                courseId: course._id,
            };

            console.log(`📤 ${editSectionId ? "Update" : "Create"} section:`, payload);

            let updatedCourse;
            if (editSectionId) {
                updatedCourse = await updateSection(payload, token);
                toast.success("✅ Section updated successfully!");
            } else {
                updatedCourse = await createSection(payload, token);
                toast.success("✅ Section created successfully!");
            }

            // Update Redux with populated course
            dispatch(setCourse(updatedCourse));
            cancelEdit();

        } catch (error) {
            console.error("❌ Section API Error:", error);
            const msg = error.response?.data?.message || error.message || "Server error";
            toast.error(`Failed to save section: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeEditSectionName = (sectionId, sectionName) => {
        if (editSectionId === sectionId) {
            cancelEdit();
            return;
        }

        setEditSectionId(sectionId);
        setValue("sectionName", sectionName);
    };

    const goToNext = () => {
        if (!course?.courseContent?.length) {
            toast.error("❌ Add at least one section first");
            return;
        }

        // Check if all sections have subsections (lectures)
        const sectionsWithLectures = course.courseContent.filter(
            (section) => section.subSection && section.subSection.length > 0
        );

        if (sectionsWithLectures.length !== course.courseContent.length) {
            toast.error("⚠️ Each section needs at least one lecture");
            return;
        }

        dispatch(setStep(3)); // Go to Publish/Thumbnail
        toast.success("✅ All sections complete! Ready to publish.");
    };

    const goBack = () => {
        dispatch(setStep(1));
    };

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
                <div className="text-center">
                    <div className="text-6xl mb-6">📚</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No Course Selected</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Create or select a course first to add sections and lectures.
                    </p>
                    <button
                        onClick={goBack}
                        className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg transition-all"
                    >
                        ← Back to Course Details
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-slate-800 bg-clip-text text-transparent mb-4">
                        Course Builder
                    </h1>
                    <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50 max-w-2xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {course.courseName}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    ID: <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                                        {course._id?.slice(-8) || "Missing"}
                                    </code>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-emerald-600">
                                    {course.courseContent?.length || 0} Sections
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add/Edit Section Form */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200/50 mb-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        {editSectionId ? "✏️ Edit Section" : "➕ Add New Section"}
                    </h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full p-6 text-xl border-2 border-dashed border-slate-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all bg-white/50 hover:border-slate-400 shadow-lg"
                                placeholder="e.g., 'Introduction to React', 'Advanced Hooks', 'Final Project'..."
                                {...register("sectionName", {
                                    required: "Section name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Section name must be at least 3 characters",
                                    },
                                    maxLength: {
                                        value: 60,
                                        message: "Section name too long",
                                    },
                                })}
                                disabled={loading}
                            />
                            {errors.sectionName && (
                                <p className="mt-3 text-sm text-red-500 bg-red-50 p-3 rounded-xl border-l-4 border-red-400">
                                    {errors.sectionName.message}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200">
                            <button
                                type="submit"
                                disabled={loading || !course?._id}
                                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {editSectionId ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    <>
                                        <IoAddCircleSharp className="text-xl" />
                                        {editSectionId ? "Update Section" : "Create Section"}
                                    </>
                                )}
                            </button>

                            {editSectionId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-8 py-4 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-2xl transition-all shadow-lg hover:shadow-xl"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Existing Sections */}
                {course?.courseContent?.length > 0 ? (
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200/50">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">📋 Course Outline</h3>
                        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/50 rounded-3xl shadow-xl border border-dashed border-slate-300">
                        <div className="text-6xl mb-6 opacity-20">📚</div>
                        <h3 className="text-2xl font-bold text-gray-600 mb-4">No sections yet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Add your first section above to start building your course structure.
                        </p>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex flex-col sm:flex-row gap-4 pt-12 mt-24 border-t-4 border-slate-200 bg-white/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl sticky bottom-0">
                    <button
                        onClick={goBack}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                    >
                        ← Back to Details
                    </button>

                    <button
                        onClick={goToNext}
                        disabled={!course?._id || loading}
                        className="flex items-center justify-center gap-3 px-12 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CgCalendarNext className="text-xl" />
                        Next: Add Lectures & Publish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseBuilder;
