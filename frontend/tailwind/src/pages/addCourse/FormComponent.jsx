import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { getAllCategories } from "../../services/operations/categoryAPI";
import { createCourse } from "../../services/operations/courseAPI";
import { setCourse, setStep } from "../../slice/courseSlice";

const FormComponent = () => {
    const dispatch = useDispatch();
    const { course, editCourse } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            courseName: "",
            courseDescription: "",
            coursePrice: "",
            courseTags: "",
            courseBenefits: "",
            courseCategory: "",
            thumbnail: null,
        },
    });

    // Fetch categories & populate form
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const categoryRes = await getAllCategories();
                const categoryList =
                    categoryRes?.data?.categories ||
                    categoryRes?.data?.data ||
                    categoryRes || [];

                setCategories(Array.isArray(categoryList) ? categoryList : []);

                // Populate if editing
                if (editCourse && course) {
                    setTimeout(() => { // Wait for categories to load
                        setValue("courseName", course.courseName || "");
                        setValue("courseDescription", course.courseDescription || "");
                        setValue("coursePrice", course.price || "");
                        setValue("courseTags", (course.tag || []).join(", ") || "");
                        setValue("courseBenefits", course.whatYouWillLearn || "");
                        setValue("courseCategory", course.category?._id || course.category || "");
                    }, 100);
                }
            } catch (error) {
                console.error("❌ Failed to load categories:", error);
                toast.error("Failed to load categories");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [editCourse, course, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const courseData = {
                courseName: data.courseName?.trim(),
                courseDescription: data.courseDescription?.trim(),
                coursePrice: data.coursePrice,
                courseTags: data.courseTags,
                courseBenefits: data.courseBenefits?.trim(),
                courseCategory: data.courseCategory,
                thumbnail: data.thumbnail,
            };

            console.log("📤 Submitting courseData:", courseData);

            // Backend creates course → returns full course with _id
            const result = await createCourse(courseData, token);

            console.log("✅ Backend created course:", result);

            // Dispatch full course object (has _id)
            dispatch(setCourse(result));

            toast.success(`"${result.courseName}" created successfully!`);
            dispatch(setStep(2)); // Go to CourseBuilder (sections)

        } catch (error) {
            console.error("❌ Form submit error:", error);
            toast.error(error.message || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue("thumbnail", file);
            toast.success(`Thumbnail selected: ${file.name}`);
        }
    };

    const goBack = () => {
        dispatch(setStep(0));
    };

    if (loading && !categories.length) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/50 to-slate-900/90 backdrop-blur-xl shadow-2xl border border-slate-700/50">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-yellow-500 bg-clip-text text-transparent mb-4">
                    {editCourse ? "✏️ Edit Course" : "🎓 Create New Course"}
                </h1>
                <p className="text-slate-400 max-w-md mx-auto">
                    Fill course details. Thumbnail & content added later.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Course Name */}
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Course Title <span className="text-pink-400">*</span>
                    </label>
                    <input
                        type="text"
                        className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-3 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all hover:border-slate-600 text-lg placeholder-slate-500"
                        placeholder="Master React with Real Projects"
                        {...register("courseName", {
                            required: "Course title is required",
                            minLength: {
                                value: 5,
                                message: "Title must be at least 5 characters",
                            },
                            maxLength: {
                                value: 100,
                                message: "Title too long",
                            },
                        })}
                    />
                    {errors.courseName && (
                        <p className="mt-2 text-sm text-pink-400 animate-pulse">
                            {errors.courseName.message}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Course Description <span className="text-pink-400">*</span>
                    </label>
                    <textarea
                        rows={4}
                        className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-3 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all resize-vertical text-lg placeholder-slate-500"
                        placeholder="Comprehensive React course covering hooks, context, state management, and real-world projects..."
                        {...register("courseDescription", {
                            required: "Description is required",
                            minLength: {
                                value: 30,
                                message: "Description must be at least 30 characters",
                            },
                        })}
                    />
                    {errors.courseDescription && (
                        <p className="mt-2 text-sm text-pink-400 animate-pulse">
                            {errors.courseDescription.message}
                        </p>
                    )}
                </div>

                {/* Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Price (₹) <span className="text-pink-400">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-3 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all text-lg placeholder-slate-500"
                            placeholder="999"
                            {...register("coursePrice", {
                                required: "Price is required",
                                min: {
                                    value: 0,
                                    message: "Price cannot be negative",
                                },
                                valueAsNumber: true,
                            })}
                        />
                        {errors.coursePrice && (
                            <p className="mt-2 text-sm text-pink-400 animate-pulse">
                                {errors.coursePrice.message}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Category <span className="text-pink-400">*</span>
                        </label>
                        <select
                            className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-3 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all text-lg"
                            {...register("courseCategory", { required: "Please select a category" })}
                            disabled={loading}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.courseCategory && (
                            <p className="mt-2 text-sm text-pink-400 animate-pulse">
                                {errors.courseCategory.message}
                            </p>
                        )}
                    </div>
                </div>
                {/* Thumbnail Image */}
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Course Thumbnail <span className="text-pink-400">*</span>
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setValue("thumbnail", e.target.files[0])}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-slate-900 file:font-semibold hover:file:bg-yellow-500 transition-all"
                    />

                    
                    {errors.thumbnail && (
                        <p className="mt-2 text-sm text-pink-400 animate-pulse">
                            Thumbnail is required
                        </p>
                    )}

                    <p className="mt-2 text-xs text-slate-500">
                        Upload a JPG / PNG image (max 5MB)
                    </p>
                </div>


                {/* Tags */}
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-3 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all text-lg placeholder-slate-500"
                        placeholder="react, javascript, frontend, hooks, projects"
                        {...register("courseTags")}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                        Helps students discover your course
                    </p>
                </div>

                {/* Learning Benefits */}
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        What will students learn? <span className="text-pink-400">*</span>
                    </label>
                    <textarea
                        rows={3}
                        className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-3 focus:ring-yellow-500/30 focus:border-yellow-500 transition-all resize-vertical text-lg placeholder-slate-500"
                        placeholder="• Build 5 complete projects\n• Master React Hooks & Context\n• Deploy to Vercel/Netlify\n• Get job-ready portfolio..."
                        {...register("courseBenefits", {
                            required: "Learning outcomes required",
                            minLength: {
                                value: 20,
                                message: "Please list key learning outcomes",
                            },
                        })}
                    />
                    {errors.courseBenefits && (
                        <p className="mt-2 text-sm text-pink-400 animate-pulse">
                            {errors.courseBenefits.message}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-8 mt-24 border-t border-slate-700/50">
                    <button
                        type="button"
                        onClick={goBack}
                        className="px-8 py-4 bg-slate-700/50 hover:bg-slate-600 border border-slate-600 text-slate-300 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        disabled={loading}
                    >
                        ← Back to Dashboard
                    </button>

                    <button
                        type="submit"
                        disabled={loading || isSubmitting}
                        className="px-12 py-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-slate-900 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                Creating Course...
                            </>
                        ) : (
                            "Save & Continue →"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormComponent;
