import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from "../services/operations/profileAPI";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    const getEnrolledCourses = useCallback(async () => {
        try {
            const res = await getUserEnrolledCourses(token);
            setEnrolledCourses(res || []);
        } catch (error) {
            console.error("Failed to fetch enrolled courses:", error);
            setEnrolledCourses([]);
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

    // Loading State with Skeleton
    if (enrolledCourses === null) {
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-4">
                <div className="h-8 bg-slate-800 rounded w-48 animate-pulse mb-6"></div>
                {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto text-slate-100 p-6 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Enrolled Courses
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">Track your learning progress and resume lectures.</p>
                </div>
                <span className="bg-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-700">
                    {enrolledCourses.length} {enrolledCourses.length === 1 ? 'Course' : 'Courses'}
                </span>
            </div>

            {/* Empty State */}
            {!enrolledCourses.length ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                    <div className="p-4 bg-slate-900 rounded-full border border-slate-800 text-slate-400 mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="text-slate-400 font-medium mb-1">No enrolled courses found</p>
                    <p className="text-sm text-slate-500">Explore the catalog to start learning something new.</p>
                </div>
            ) : (
                /* Course List */
                <div className="grid grid-cols-1 gap-4">
                    {enrolledCourses.map((course) => {
                        const progress = course.progressPercentage || 0;
                        return (
                            <div
                                key={course._id}
                                className="group flex flex-col sm:flex-row items-start sm:items-center p-5 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl space-y-4 sm:space-y-0"
                                onClick={() => handleCourseClick(course)}
                            >
                                {/* Thumbnail */}
                                <div className="w-full sm:w-28 aspect-video relative overflow-hidden rounded-xl flex-shrink-0 bg-slate-800">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.courseName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0 sm:ml-5 w-full">
                                    <h3 className="font-bold text-lg text-slate-200 group-hover:text-emerald-400 transition-colors duration-200 truncate mb-1">
                                        {course.courseName}
                                    </h3>
                                    <p className="text-sm text-slate-400 line-clamp-1 pr-4">
                                        {course.courseDescription}
                                    </p>
                                </div>

                                {/* Duration & Progress */}
                                <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end flex-shrink-0 pt-3 sm:pt-0 border-t border-slate-800/60 sm:border-t-0 sm:ml-6">
                                    <span className="text-xs font-medium text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 sm:mb-3">
                                        {course.totalDuration || "Self-paced"}
                                    </span>
                                    <div className="w-32 sm:text-right">
                                        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                                            <span className="text-slate-500 sm:hidden">Progress</span>
                                            <span className={progress === 100 ? "text-emerald-400" : "text-slate-300"}>
                                                {progress}%
                                            </span>
                                        </div>
                                        <ProgressBar
                                            completed={progress}
                                            height="6px"
                                            bgColor={progress === 100 ? "#10b981" : "#0ea5e9"}
                                            baseBgColor="#1e293b"
                                            isLabelVisible={false}
                                        />
                                    </div>
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