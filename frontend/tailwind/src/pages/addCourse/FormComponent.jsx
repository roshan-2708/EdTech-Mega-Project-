import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";  // ✅ Removed unused dispatch
import { useForm } from "react-hook-form";
import { getAllCategories } from "../../services/operations/categoryAPI";

const FormComponent = () => {
    const { course, editCourse } = useSelector((state) => state.course);

    const [loading, setLoading] = useState(false);
    const [courseCategory, setCourseCategory] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            courseName: "",
            courseDescription: "",
            coursePrice: "",
            courseTags: "",
            courseBenefits: "",
            courseCategory: "",
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const categories = await getAllCategories();
            if (Array.isArray(categories) && categories.length > 0) {
                setCourseCategory(categories);
            }

            if (editCourse && course) {
                reset({
                    courseName: course.courseName || "",
                    courseDescription: course.courseDescription || "",
                    coursePrice: course.price || "",
                    courseTags: course.tag || "",
                    courseBenefits: course.whatYouWillLearn || "",
                    courseCategory: course.categoryId || "",
                });
            }

            setLoading(false);
        };

        fetchData();
    }, [editCourse, course, reset]);

    const onSubmit = async (data) => {
        console.log("FORM DATA =>", data);
    };

    return (
        <div className="rounded-xl bg-slate-900/70 p-6 text-white shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
                {editCourse ? "Edit Course Information" : "Course Information"}
            </h2>
            <p className="mb-6 text-sm text-slate-400">
                Fill out the basic details for your course. Fields marked with * are mandatory.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Course Title */}
                <div>
                    <label htmlFor="courseName" className="mb-1 block text-sm font-medium">
                        Course Title <sup className="text-pink-500">*</sup>
                    </label>
                    <input
                        id="courseName"
                        type="text"
                        placeholder="e.g. Master React with Projects"
                        className="w-full rounded-md bg-slate-950 px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-yellow-400"
                        {...register("courseName", {
                            required: "Course title is required",
                            minLength: { value: 3, message: "Title must be at least 3 characters" },
                        })}
                    />
                    {errors.courseName && (
                        <p className="mt-1 text-xs text-pink-400">{errors.courseName.message}</p>
                    )}
                </div>

                {/* Course Description */}
                <div>
                    <label htmlFor="courseDescription" className="mb-1 block text-sm font-medium">
                        Course Description <sup className="text-pink-500">*</sup>
                    </label>
                    <textarea
                        id="courseDescription"
                        rows={4}
                        placeholder="Briefly describe what this course is about..."
                        className="w-full rounded-md bg-slate-950 px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-yellow-400"
                        {...register("courseDescription", {
                            required: "Description is required",
                            minLength: { value: 10, message: "Description must be at least 10 characters" },
                        })}
                    />
                    {errors.courseDescription && (
                        <p className="mt-1 text-xs text-pink-400">{errors.courseDescription.message}</p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <label htmlFor="coursePrice" className="mb-1 block text-sm font-medium">
                        Course Price (₹) <sup className="text-pink-500">*</sup>
                    </label>
                    <input
                        id="coursePrice"
                        type="number"
                        placeholder="e.g. 999"
                        className="w-full rounded-md bg-slate-950 px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-yellow-400"
                        {...register("coursePrice", {
                            required: "Price is required",
                            min: { value: 0, message: "Price cannot be negative" },
                        })}
                    />
                    {errors.coursePrice && (
                        <p className="mt-1 text-xs text-pink-400">{errors.coursePrice.message}</p>
                    )}
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="courseTags" className="mb-1 block text-sm font-medium">
                        Course Tags
                    </label>
                    <input
                        id="courseTags"
                        type="text"
                        placeholder="e.g. react, frontend, hooks"
                        className="w-full rounded-md bg-slate-950 px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-yellow-400"
                        {...register("courseTags")}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                        Separate tags with commas; helps students discover your course.
                    </p>
                </div>

                {/* Benefits */}
                <div>
                    <label htmlFor="courseBenefits" className="mb-1 block text-sm font-medium">
                        What will students learn? <sup className="text-pink-500">*</sup>
                    </label>
                    <textarea
                        id="courseBenefits"
                        rows={4}
                        placeholder="List key outcomes, e.g. 'Build full-stack MERN apps, deploy to cloud...'"
                        className="w-full rounded-md bg-slate-950 px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-yellow-400"
                        {...register("courseBenefits", {
                            required: "Please describe the learning outcomes",
                        })}
                    />
                    {errors.courseBenefits && (
                        <p className="mt-1 text-xs text-pink-400">{errors.courseBenefits.message}</p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label htmlFor="courseCategory" className="mb-1 block text-sm font-medium">
                        Course Category <sup className="text-pink-500">*</sup>
                    </label>
                    <select
                        id="courseCategory"
                        disabled={loading}
                        className="w-full rounded-md bg-slate-950 px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                        {...register("courseCategory", {
                            required: "Please select a category",
                        })}
                    >
                        <option value="">Select a category</option>
                        {courseCategory.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.courseCategory && (
                        <p className="mt-1 text-xs text-pink-400">{errors.courseCategory.message}</p>
                    )}
                </div>

                {/* Thumbnail */}
                <div>
                    <label htmlFor="courseImage" className="mb-1 block text-sm font-medium">
                        Course Thumbnail
                    </label>
                    <input
                        id="courseImage"
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-yellow-400 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-950 hover:file:bg-yellow-300"
                        {...register("courseImage")}
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                        type="button"
                        className="rounded-md px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                        onClick={() => reset()}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting
                            ? "Saving..."
                            : editCourse
                                ? "Update & Continue"
                                : "Save & Continue"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormComponent;
