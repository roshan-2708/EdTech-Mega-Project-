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
                ...(editSectionId && { sectionId: editSectionId }),
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
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-gray-100">
            <div className="mx-auto max-w-6xl space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-semibold">
                        Course Builder
                    </h1>

                    <div className="mx-auto max-w-2xl rounded-xl bg-slate-900 p-5 border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-medium">
                                    {course.courseName}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    ID:{" "}
                                    <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
                                        {course._id?.slice(-8) || "Missing"}
                                    </code>
                                </p>
                            </div>

                            <p className="text-sm font-medium text-emerald-400">
                                {course.courseContent?.length || 0} Sections
                            </p>
                        </div>
                    </div>
                </div>

                {/* Add / Edit Section */}
                <div className="rounded-xl bg-slate-900 p-6 border border-slate-800">
                    <h3 className="mb-4 text-lg font-medium">
                        {editSectionId ? "Edit Section" : "Add Section"}
                    </h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
                        <div>
                            <input
                                type="text"
                                disabled={loading}
                                placeholder="Section name"
                                className="w-full rounded-lg bg-slate-800 px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                {...register("sectionName", {
                                    required: "Section name is required",
                                    minLength: { value: 3, message: "Minimum 3 characters" },
                                    maxLength: { value: 60, message: "Maximum 60 characters" },
                                })}
                            />

                            {errors.sectionName && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.sectionName.message}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-medium transition disabled:opacity-50"
                            >
                                {loading
                                    ? "Saving..."
                                    : editSectionId
                                        ? "Update"
                                        : "Create"}
                            </button>

                            {editSectionId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    disabled={loading}
                                    className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Course Outline */}
                {course?.courseContent?.length > 0 ? (
                    <div className="rounded-xl bg-slate-900 p-6 border border-slate-800">
                        <h3 className="mb-4 text-lg font-medium">
                            Course Outline
                        </h3>
                        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
                    </div>
                ) : (
                    <div className="rounded-xl bg-slate-900 p-12 text-center border border-slate-800">
                        <p className="text-gray-400">
                            No sections added yet
                        </p>
                    </div>
                )}

                {/* Navigation */}
                <div className="sticky bottom-0 bg-slate-950 pt-6 border-t border-slate-800">
                    <div className="flex flex-col sm:flex-row gap-3 max-w-6xl mx-auto">
                        <button
                            onClick={goBack}
                            className="flex-1 rounded-lg bg-slate-700 hover:bg-slate-600 py-3 font-medium transition"
                        >
                            Back
                        </button>

                        <button
                            onClick={goToNext}
                            disabled={loading}
                            className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 py-3 font-medium transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <CgCalendarNext />
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );


};

export default CourseBuilder;
