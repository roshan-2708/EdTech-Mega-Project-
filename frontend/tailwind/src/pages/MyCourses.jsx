import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { deleteCourse } from "../services/operations/courseAPI";
import toast from "react-hot-toast";

const InstructorCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const { token } = useSelector((state) => state.auth);

    // ✅ Fixed: Use token from Redux consistently
    const fetchInstructorCourses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/v1/course/instructor-courses", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            const data = await response.json();
            console.log("Instructor Courses:", data);
            setCourses(data.data || []);
        } catch (error) {
            console.error("Error fetching instructor courses:", error);
            toast.error("Failed to fetch courses");
            setCourses([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Replace your handleDeleteCourse with this safe version:
    const handleDeleteCourse = async (courseId, courseName) => {
        const confirmDelete = window.confirm(
            `Delete "${courseName}"? This cannot be undone.`
        );

        if (!confirmDelete) return;

        setDeletingId(courseId);
        try {
            console.log("🗑️ Deleting course:", courseId); // Debug log

            const result = await deleteCourse(courseId, token);
            console.log("✅ Delete result:", result); // Debug log

            if (result?.data?.success) {
                toast.success("✅ Course deleted successfully!");
                // Optimistic update - remove immediately
                setCourses(prev => prev.filter(course => course._id !== courseId));
            }
        } catch (error) {
            console.error("❌ Delete error details:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                url: error.config?.url
            });
            toast.error(error.response?.data?.message || "Failed to delete course");
        } finally {
            setDeletingId(null);
        }
    };


    useEffect(() => {
        if (token) {
            fetchInstructorCourses();
        }
    }, [fetchInstructorCourses, token]);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-pulse space-y-2">
                    <div className="w-12 h-12 bg-slate-700 rounded-full mx-auto"></div>
                    <div className="text-white text-lg">Loading courses...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        My Courses
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 max-w-md">
                        Manage and update your published and draft courses in one place.
                    </p>
                </div>

                <Link
                    to="/dashboard/add-course"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 text-sm font-semibold text-black shadow-lg hover:shadow-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 rounded-xl"
                >
                    <span className="text-lg">+</span>
                    <span>New Course</span>
                </Link>
            </div>

            {/* Courses Table */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden">
                {courses.length === 0 ? (
                    <div className="p-16 text-center py-24">
                        <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl text-slate-500">📚</span>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-200 mb-2">
                            No courses yet
                        </h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">
                            Get started by creating your first course. Share your knowledge with thousands of students.
                        </p>
                        <Link
                            to="/dashboard/add-course"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all"
                        >
                            Create First Course
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/90 backdrop-blur-sm sticky top-0 z-10">
                                <tr className="border-b border-slate-700">
                                    <th className="p-6 font-semibold text-slate-300 text-left w-3/5">Course</th>
                                    <th className="p-6 font-semibold text-slate-300 text-left">Duration</th>
                                    <th className="p-6 font-semibold text-slate-300 text-left">Price</th>
                                    <th className="p-6 font-semibold text-slate-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr
                                        key={course._id}
                                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-all duration-200 last:border-b-0"
                                    >
                                        {/* Course Details */}
                                        <td className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={course.thumbnail || "/api/placeholder/112/64"}
                                                        alt={course.courseName}
                                                        className="w-28 h-16 object-cover rounded-xl border-2 border-slate-700/50 shadow-md"
                                                        onError={(e) => {
                                                            e.target.src = "/api/placeholder/112/64";
                                                        }}
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        to={`/dashboard/edit-course/${course._id}`}
                                                        className="block font-semibold text-slate-100 hover:text-blue-400 transition-colors line-clamp-1 mb-1 text-lg"
                                                    >
                                                        {course.courseName}
                                                    </Link>
                                                    <p className="text-sm text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                                                        {course.courseDescription || "No description available"}
                                                    </p>

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${course.status === "Published"
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`h-2 w-2 rounded-full ${course.status === "Published" ? "bg-emerald-400" : "bg-amber-400"
                                                                }`}
                                                        />
                                                        {course.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Duration */}
                                        <td className="p-6 text-slate-300">
                                            {course.courseDuration ? (
                                                <>
                                                    {course.courseDuration}
                                                    <span className="text-sm text-slate-500 ml-1">hrs</span>
                                                </>
                                            ) : (
                                                <span className="text-slate-500">--</span>
                                            )}
                                        </td>

                                        {/* Price */}
                                        <td className="p-6 font-mono text-lg font-semibold text-emerald-400">
                                            ₹{course.price?.toLocaleString() || "0"}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/dashboard/edit-course/${course._id}`}
                                                    className="group relative p-2 rounded-xl border-2 border-slate-700/50 hover:border-blue-500/60 hover:bg-blue-500/10 transition-all duration-200 flex items-center justify-center"
                                                    title="Edit Course"
                                                >
                                                    <FaEdit className="text-lg text-blue-400 group-hover:text-blue-300 transition-colors" />
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCourse(course._id, course.courseName)}
                                                    disabled={deletingId === course._id}
                                                    className={`group relative p-2 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${deletingId === course._id
                                                        ? "border-slate-600/50 bg-slate-800/30 text-slate-500 cursor-not-allowed"
                                                        : "border-red-600/40 hover:border-red-500/60 hover:bg-red-500/10 text-red-400 hover:text-red-300"
                                                        }`}
                                                    title={deletingId === course._id ? "Deleting..." : "Delete Course"}
                                                >
                                                    {deletingId === course._id ? (
                                                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <MdDeleteForever className="text-lg group-hover:scale-110 transition-transform" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorCourses;
