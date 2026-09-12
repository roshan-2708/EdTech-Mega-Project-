import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from "../services/operations/profileAPI";
import { useNavigate } from "react-router-dom";
import { HiFire } from "react-icons/hi";
import { FiSearch, FiCheckCircle, FiPlay, FiAward } from "react-icons/fi";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

// Shimmer Skeleton for better UX during loading
const SkeletonCard = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center p-5 bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse space-y-4 sm:space-y-0">
        <div className="w-full sm:w-28 aspect-video bg-slate-800 rounded-xl"></div>
        <div className="flex-1 space-y-3 w-full sm:ml-5">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-3 bg-slate-800 rounded w-2/3"></div>
        </div>
        <div className="w-full sm:w-32 space-y-2 sm:text-right">
            <div className="h-3 bg-slate-800 rounded w-16 sm:ml-auto"></div>
            <div className="h-2 bg-slate-800 rounded w-full"></div>
        </div>
    </div>
);

const EnrollCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const getEnrolledCourses = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getUserEnrolledCourses(token);
            setEnrolledCourses(res || []);
        } catch (error) {
            console.error("Failed to fetch enrolled courses:", error);
            setEnrolledCourses([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) getEnrolledCourses();
    }, [token, getEnrolledCourses]);

    const handleCourseClick = (course) => {
        const firstSectionId = course.courseContent?.[0]?._id;
        const firstSubSectionId = course.courseContent?.[0]?.subSection?.[0]?._id;

        if (firstSectionId && firstSubSectionId) {
            navigate(`/view-course/${course._id}/section/${firstSectionId}/sub-section/${firstSubSectionId}`);
        } else {
            navigate(`/view-course/${course._id}`);
        }
    };

    if (loading && !enrolledCourses) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (enrolledCourses === null) {
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-4">
                <div className="h-8 rounded w-48 animate-pulse mb-6"></div>
                {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
            </div>
        );
    }

    // Filter logic simulation based on search and tabs
    const filteredCourses = enrolledCourses.filter((course) => {
        const matchesSearch = course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              course.courseDescription?.toLowerCase().includes(searchTerm.toLowerCase());
        const progress = course.progressPercentage || 0;
        if (filter === "In Progress") return matchesSearch && progress < 100;
        if (filter === "Completed") return matchesSearch && progress === 100;
        return matchesSearch;
    });

    return (
        <div className="max-w-5xl mx-auto text-slate-100 p-6 min-h-screen space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Enrolled Courses
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Track your learning velocity and resume key lectures.</p>
                </div>
                <span className="bg-slate-800 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-slate-700 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    {enrolledCourses.length} Active
                </span>
            </div>

            {/* Top Stats Overview Cards */}
            <div className="grid grid-cols-3 gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center">
                <div className="border-r border-slate-800">
                    <p className="text-xl sm:text-2xl font-bold text-slate-50">3</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Completed</p>
                </div>
                <div className="border-r border-slate-800">
                    <p className="text-xl sm:text-2xl font-bold text-slate-50">1</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">In Flight</p>
                </div>
                <div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-50">85%</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Total Rate</p>
                </div>
            </div>

            {/* Search and Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search modules, stacks or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {["All", "In Progress", "Completed"].map((tab) => {
                        const count = tab === "All" ? enrolledCourses.length : 
                                      tab === "In Progress" ? enrolledCourses.filter(c => (c.progressPercentage || 0) < 100).length :
                                      enrolledCourses.filter(c => (c.progressPercentage || 0) === 100).length;
                        const activeTabName = tab === "All" ? "All Courses" : tab === "In Progress" ? "In Progress" : "Completed";
                        return (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-xl text-xs font-medium border transition ${
                                    filter === tab 
                                        ? "bg-slate-800 text-yellow-400 border-slate-700" 
                                        : "bg-slate-900/40 text-slate-400 border-slate-800/80 hover:bg-slate-800/50"
                                }`}
                            >
                                {activeTabName} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Daily Streak Tracker Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <HiFire className="text-xl" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">Daily Streak</p>
                            <p className="text-base font-bold text-slate-100">14 Day Streak</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-500/25 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            ACTIVE
                        </span>
                        <div className="flex items-center gap-1 text-slate-400">
                            <button className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60"><BiChevronLeft /></button>
                            <button className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60"><BiChevronRight /></button>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-400">Watch at least 1 lecture daily to preserve your streak. Missed days lose streak color.</p>

                {/* Calendar Grid Representation */}
                <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <span className="flex items-center gap-1.5"><span className="text-amber-500">📅</span> September 2026</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-slate-500 font-medium">
                        {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map(d => <span key={d}>{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                        {Array.from({ length: 30 }).map((_, i) => {
                            const day = i + 1;
                            const isActiveStreak = day <= 14;
                            const isToday = day === 14;
                            return (
                                <div
                                    key={day}
                                    className={`py-2 rounded-lg font-medium transition relative ${
                                        isToday 
                                            ? "bg-amber-500 text-slate-950 font-bold ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20" 
                                            : isActiveStreak 
                                            ? "bg-amber-600/90 text-white" 
                                            : "bg-slate-900/40 text-slate-600"
                                    }`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                            <span>Lecture completed</span>
                            <span className="h-2 w-2 rounded-full bg-slate-800 ml-2"></span>
                            <span>Color off (Inactive)</span>
                        </div>
                        <span className="text-amber-400 font-medium">🔥 1 Freeze left</span>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {!filteredCourses.length ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                    <div className="p-4 bg-slate-900 rounded-full border border-slate-800 text-slate-400 mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="text-slate-400 font-medium mb-1">No matching courses found</p>
                    <p className="text-sm text-slate-500">Try adjusting your search query or filter options.</p>
                </div>
            ) : (
                /* Course List Grid */
                <div className="grid grid-cols-1 gap-4">
                    {filteredCourses.map((course, idx) => {
                        const progress = course.progressPercentage || (idx === 0 ? 40 : 100);
                        const isCurrentFocus = idx === 0 && progress < 100;
                        const isCompleted = progress === 100;

                        return (
                            <div
                                key={course._id || idx}
                                className={`group flex flex-col p-5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl space-y-4 ${
                                    isCurrentFocus ? "border-slate-700 bg-slate-900/90 ring-1 ring-slate-700/50" : "border-slate-800 hover:border-slate-700"
                                }`}
                                onClick={() => handleCourseClick(course)}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                                        {/* Thumbnail */}
                                        <div className="w-full sm:w-24 aspect-video relative overflow-hidden rounded-xl flex-shrink-0 bg-slate-800 border border-slate-700/50">
                                            <img
                                                src={course.thumbnail || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&auto=format&fit=crop&q=60"}
                                                alt={course.courseName}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {isCurrentFocus ? (
                                                    <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 uppercase tracking-wider">Current Focus</span>
                                                ) : isCompleted ? (
                                                    <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                                        <FiCheckCircle className="text-xs" /> Finished
                                                    </span>
                                                ) : null}
                                            </div>
                                            <h3 className="font-bold text-base sm:text-lg text-slate-100 group-hover:text-yellow-400 transition-colors duration-200 truncate">
                                                {course.courseName}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-400 line-clamp-1 mt-0.5">
                                                {course.courseDescription || "Modern state architecture, custom hooks, and performance micro-optimizations."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action button / Duration */}
                                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t border-slate-800/60 sm:border-t-0 gap-3">
                                        <span className="text-xs font-medium text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 flex items-center gap-1">
                                            ⏱️ {course.totalDuration || "1h 45m left"}
                                        </span>
                                        {isCurrentFocus ? (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleCourseClick(course); }}
                                                className="flex items-center gap-1.5 bg-slate-50 text-slate-950 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-slate-200 transition shadow"
                                            >
                                                <FiPlay className="text-xs fill-current" /> Resume Lecture
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleCourseClick(course); }}
                                                className="flex items-center gap-1.5 bg-slate-800 text-slate-200 hover:text-yellow-400 font-medium text-xs px-3.5 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-750 transition"
                                            >
                                                <FiAward className="text-xs text-yellow-400" /> {idx === 2 ? "Credentials" : "Review"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar Area */}
                                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                                    <div className="flex items-center justify-between text-xs font-semibold">
                                        <span className="text-slate-400">Course Completion</span>
                                        <span className={progress === 100 ? "text-emerald-400 font-bold" : "text-slate-200"}>
                                            {progress}%
                                        </span>
                                    </div>
                                    <ProgressBar
                                        completed={progress}
                                        height="6px"
                                        bgColor={progress === 100 ? "#10b981" : "#f59e0b"}
                                        baseBgColor="#1e293b"
                                        isLabelVisible={false}
                                    />
                                </div>

                                {/* Footer info per card */}
                                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                                    <span>{isCurrentFocus ? "Module 8 of 20" : isCompleted ? (idx === 2 ? "Certificate Claimed" : "All Lessons Complete") : "In Progress"}</span>
                                    <span>{progress === 100 ? "100% finished" : `${100 - progress}% remaining`}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EnrollCourses;