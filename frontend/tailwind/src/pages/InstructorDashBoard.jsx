import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom'
import { getInstructorCourses } from "../services/operations/courseAPI";
import { getInstructorData } from "../services/operations/profileAPI";
import InstructorChart from "./InstructorChart";

const InstructorDashBoard = () => {
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const instructorApiData = await getInstructorData(token);
            const instructorCourses = await getInstructorCourses(token);
            setInstructorData(instructorApiData || null);
            setCourses(instructorCourses || []);
            setLoading(false);
        };
        if (token) fetchData();
    }, [token]);

    const totalAmount = instructorData?.reduce((acc, curr) => acc + (curr.totalAmountGenerated || 0), 0) || 0;
    const totalStudent = instructorData?.reduce((acc, curr) => acc + (curr.totalStudentsEnrolled || 0), 0) || 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-2">
            {/* Hero Section */}
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
                        Welcome Back, {user?.firstName} {user?.lastName}
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Let's start something new
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Chart Column */}
                    <div className="lg:col-span-2">
                        <InstructorChart courses={instructorData} />
                    </div>

                    {/* Stats Column */}
                    <div className="space-y-6">
                        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                            <h3 className="text-2xl font-bold text-slate-100 mb-8">Statistics</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-slate-700 rounded-xl">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Total Courses</p>
                                        <p className="text-3xl font-bold text-slate-100 mt-1">{courses.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-slate-700 rounded-xl">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Total Students</p>
                                        <p className="text-3xl font-bold text-slate-100 mt-1">{totalStudent.toLocaleString()}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-slate-700 rounded-xl">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Total Income</p>
                                        <p className="text-3xl font-bold text-slate-100 mt-1">₹{totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="text-center mb-16">
                    <Link
                        to="/dashboard/my-courses"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold text-lg rounded-2xl transition-colors duration-200 border-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        View All Courses
                    </Link>
                </div>

                {/* Recent Courses */}
                <div>
                    <h3 className="text-3xl font-bold text-slate-100 mb-12 text-center">Recent Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {courses.slice(0, 4).map((course) => (
                            <div key={course._id} className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:bg-slate-750 transition-colors duration-200 flex flex-col min-h-[380px]">
                                <div className="flex-1 mb-6">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.courseName}
                                        className="w-full h-56 object-cover rounded-xl"
                                        loading="lazy"
                                    />
                                </div>

                                <h4 className="text-xl font-bold text-slate-100 mb-6 line-clamp-2 leading-tight">
                                    {course.courseName}
                                </h4>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-700 mt-auto">
                                    <div className="flex items-center gap-3 text-lg font-semibold text-slate-300">
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-emerald-400">{course.studentEnrolled?.length || 0} students</span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-100">₹{course.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashBoard;
