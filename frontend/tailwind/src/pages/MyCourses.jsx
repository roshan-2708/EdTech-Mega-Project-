import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";


const InstructorCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInstructorCourses = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/v1/course/instructor-courses",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );


            console.log("Instructor Courses:", response.data);
            setCourses(response.data.data); // ✅ VERY IMPORTANT
        } catch (error) {
            console.error("Error fetching instructor courses:", error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructorCourses();
    }, []);

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div className="p-6 text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">My Courses</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Manage and update your published and draft courses in one place.
                    </p>
                </div>

                <Link
                    to="/dashboard/add-course"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow hover:bg-yellow-300 transition-colors"
                >
                    <span className="text-lg">+</span>
                    <span>New course</span>
                </Link>
            </div>

            {/* Card wrapper */}
            <div className="bg-slate-900/80 backdrop-blur rounded-xl border border-slate-800 shadow-md">
                {/* Table container for horizontal scroll */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800/80 border-b border-slate-700">
                            <tr className="text-slate-300">
                                <th className="p-4 font-medium">Course</th>
                                <th className="p-4 font-medium">Duration</th>
                                <th className="p-4 font-medium">Price</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="p-10 text-center text-slate-400 text-sm"
                                    >
                                        No courses created yet.{" "}
                                        <span className="text-yellow-400">
                                            Start by creating your first course.
                                        </span>
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr
                                        key={course._id}
                                        className="border-b border-slate-800/80 last:border-0 hover:bg-slate-800/50 transition-colors"
                                    >
                                        {/* Course cell */}
                                        <td className="p-4">
                                            <div className="flex gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={course.thumbnail}
                                                        alt={course.courseName}
                                                        className="w-28 h-16 object-cover rounded-md border border-slate-700"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <p className="font-medium text-slate-50 line-clamp-1">
                                                        {course.courseName}
                                                    </p>
                                                    <p className="text-xs text-slate-400 line-clamp-2 max-w-md">
                                                        {course.courseDescription?.slice(0, 100)}...
                                                    </p>

                                                    <span
                                                        className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${course.status === "Published"
                                                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                                                            : "bg-amber-500/10 text-amber-300 border border-amber-500/40"
                                                            }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${course.status === "Published"
                                                                ? "bg-emerald-400"
                                                                : "bg-amber-400"
                                                                }`}
                                                        />
                                                        {course.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Duration */}
                                        <td className="p-4 align-top text-slate-200 whitespace-nowrap">
                                            {course.courseDuration ? (
                                                <>
                                                    {course.courseDuration}{" "}
                                                    <span className="text-xs text-slate-400">hours</span>
                                                </>
                                            ) : (
                                                <span className="text-slate-500 text-xs">--</span>
                                            )}
                                        </td>

                                        {/* Price */}
                                        <td className="p-4 align-top text-slate-200 whitespace-nowrap">
                                            ₹{course.price}
                                        </td>

                                        {/* Actions */}
                                        <td className="p-4 align-top">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    to={`/dashboard/edit-course/${course._id}`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/60 transition-colors"
                                                >
                                                    <FaEdit className="text-base" />
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-colors"
                                                // onClick={() => handleDelete(course._id)}
                                                >
                                                    <MdDeleteForever className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default InstructorCourses;
