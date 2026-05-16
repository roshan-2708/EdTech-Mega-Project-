import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { deleteCourse } from "../services/operations/courseAPI";
import toast from "react-hot-toast";
import { getInstructorCourses } from "../services/operations/courseAPI";

const InstructorCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const { token } = useSelector((state) => state.auth);


    const fetchInstructorCourses = useCallback(async () => {
        try {
            setLoading(true);
            const coursesData = await getInstructorCourses(token);
            setCourses(coursesData);
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
            console.log(" Deleting course:", courseId); // Debug log

            const result = await deleteCourse(courseId, token);
            console.log(" Delete result:", result); // Debug log

            if (result?.data?.success) {
                toast.success(" Course deleted successfully!");
                // Optimistic update - remove immediately
                setCourses(prev => prev.filter(course => course._id !== courseId));
            }
        } catch (error) {
            console.error(" Delete error details:", {
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
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto bg-slate-950 text-slate-100 min-h-screen antialiased">

            {/* Dashboard Header Container */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-900">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                        My Courses
                    </h1>
                    <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-md">
                        Manage, analyze, and update your published and draft courses in one control system.
                    </p>
                </div>

                <Link
                    to="/dashboard/add-course"
                    className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/20 transition-all duration-200 rounded-xl active:scale-95"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Course
                </Link>
            </div>

            {/* Courses Interactive Table Shell */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
                {courses.length === 0 ? (

                    /* Clean Premium Empty State Component */
                    <div className="p-12 text-center py-20 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 mb-4 shadow-inner">
                            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 mb-1">No courses created yet</h3>
                        <p className="text-xs text-slate-400 mb-6 max-w-sm leading-relaxed">
                            Get started by creating your first course. Build structural chapters and open up learning tracks for students.
                        </p>
                        <Link
                            to="/dashboard/add-course"
                            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-5 py-2.5 rounded-xl text-xs font-bold text-yellow-400 transition-all shadow-sm"
                        >
                            Create First Course
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950/40 border-b border-slate-900">
                                    <th className="p-4 pl-6 font-bold text-xs uppercase text-slate-400 tracking-wider w-7/12">Course Catalog</th>
                                    <th className="p-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Duration</th>
                                    <th className="p-4 font-bold text-xs uppercase text-slate-400 tracking-wider">Pricing</th>
                                    <th className="p-4 pr-6 font-bold text-xs uppercase text-slate-400 tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900 bg-transparent">
                                {courses.map((course) => (
                                    <tr
                                        key={course._id}
                                        className="group hover:bg-slate-900/30 transition-all duration-150"
                                    >
                                        {/* Main Column Identity Card */}
                                        <td className="p-4 pl-6">
                                            <div className="flex items-start gap-4">
                                                <div className="relative aspect-video w-24 md:w-28 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 shrink-0">
                                                    <img
                                                        src={course.thumbnail || "/api/placeholder/112/64"}
                                                        alt={course.courseName}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <div className="space-y-1 min-w-0">
                                                    <Link
                                                        to={`/dashboard/edit-course/${course._id}`}
                                                        className="block font-bold text-slate-200 group-hover:text-yellow-400 transition-colors line-clamp-1 text-sm md:text-base leading-snug"
                                                    >
                                                        {course.courseName}
                                                    </Link>
                                                    <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">
                                                        {course.courseDescription || "No catalog index summary description has been added for this element."}
                                                    </p>

                                                    {/* Pure SaaS Status Badges */}
                                                    <div className="pt-1">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold border tracking-wide uppercase ${course.status === "Published"
                                                                    ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                                                                    : "bg-amber-500/5 text-amber-400 border-amber-500/20"
                                                                }`}
                                                        >
                                                            <span className={`h-1 w-1 rounded-full ${course.status === "Published" ? "bg-emerald-400" : "bg-amber-400"}`} />
                                                            {course.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Duration Matrix Cell */}
                                        <td className="p-4 align-middle">
                                            {course.courseDuration ? (
                                                <div className="text-sm font-semibold text-slate-300">
                                                    {course.courseDuration}
                                                    <span className="text-xs text-slate-500 ml-0.5 font-medium">hrs</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-600 font-mono text-sm">--</span>
                                            )}
                                        </td>

                                        {/* Pure Local Pricing Models */}
                                        <td className="p-4 align-middle">
                                            <span className="text-sm font-bold text-white">
                                                ₹{course.price?.toLocaleString() || "0"}
                                            </span>
                                        </td>

                                        {/* Actions Utility Elements */}
                                        <td className="p-4 pr-6 align-middle">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/dashboard/edit-course/${course._id}`}
                                                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-yellow-400 hover:border-yellow-400/30 transition-all shadow-sm"
                                                    title="Modify Content"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCourse(course._id, course.courseName)}
                                                    disabled={deletingId === course._id}
                                                    className={`p-2 rounded-xl bg-slate-950 border transition-all shadow-sm ${deletingId === course._id
                                                            ? "border-slate-800 text-slate-600 cursor-not-allowed"
                                                            : "border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/20"
                                                        }`}
                                                    title="Delete Entry"
                                                >
                                                    {deletingId === course._id ? (
                                                        <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
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
