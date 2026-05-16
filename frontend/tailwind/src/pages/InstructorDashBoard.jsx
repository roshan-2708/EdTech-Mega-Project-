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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 antialiased">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Hero Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800 pb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                            Welcome Back, <span className="text-yellow-400">{user?.firstName || 'Instructor'}</span> {user?.lastName}
                        </h1>
                        <p className="text-base text-slate-400">
                            Here's your performance overview and recent activity.
                        </p>
                    </div>
                    <div>
                        <Link
                            to="/dashboard/my-courses"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-slate-950 font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/20 active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            View All Courses
                        </Link>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Column */}
                    <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-white tracking-wide">Revenue & Analytics</h3>
                            <p className="text-xs text-slate-400">Course-wise performance breakdown</p>
                        </div>
                        <div className="h-[340px] flex items-center justify-center">
                            <InstructorChart courses={instructorData} />
                        </div>
                    </div>

                    {/* Stats Column */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 lg:space-y-4 lg:gap-0">
                        {/* Stat 1 */}
                        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Courses</p>
                                <p className="text-2xl font-black text-white mt-1">{courses?.length || 0}</p>
                            </div>
                            <div className="w-11 h-11 bg-yellow-400/10 rounded-xl flex items-center justify-center border border-yellow-400/20">
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>

                        {/* Stat 2 */}
                        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
                                <p className="text-2xl font-black text-white mt-1">{totalStudent?.toLocaleString() || 0}</p>
                            </div>
                            <div className="w-11 h-11 bg-yellow-400/10 rounded-xl flex items-center justify-center border border-yellow-400/20">
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Stat 3 */}
                        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
                                <p className="text-2xl font-black text-white mt-1">₹{totalAmount?.toLocaleString() || 0}</p>
                            </div>
                            <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Courses Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold tracking-tight text-white">Recent Courses</h3>
                        <span className="text-xs text-slate-500 font-medium bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                            Showing latest {courses?.slice(0, 4).length || 0}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {courses?.slice(0, 4).map((course) => (
                            <div
                                key={course._id}
                                className="group bg-slate-900/40 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-yellow-500/30 hover:bg-slate-900 transition-all duration-300 flex flex-col"
                            >
                                {/* Course Thumbnail Container */}
                                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-800/50">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.courseName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Course Details */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <h4 className="text-base font-bold text-slate-100 group-hover:text-yellow-400 line-clamp-2 transition-colors duration-200 min-h-[48px] leading-snug">
                                            {course.courseName}
                                        </h4>
                                    </div>

                                    {/* Footer Content */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                            </svg>
                                            <span>{course.studentEnrolled?.length || 0} Students</span>
                                        </div>
                                        <span className="text-lg font-extrabold text-white">
                                            ₹{course.price?.toLocaleString()}
                                        </span>
                                    </div>
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
