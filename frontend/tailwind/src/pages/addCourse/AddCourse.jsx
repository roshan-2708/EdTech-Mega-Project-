import React from "react";
import { Link } from "react-router-dom";
import CourseComponent from "./CourseComponent";

const AddCourse = () => {
    return (
        <div className="min-h-screen  px-4 py-6 text-white">
            <div className="mx-auto max-w-6xl">
                {/* Top bar */}
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard/my-courses"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:border-slate-500 hover:bg-slate-800/60 transition-colors"
                        >
                            <span className="text-lg">←</span>
                            <span>Back to my courses</span>
                        </Link>
                    </div>
                </div>

                {/* Page title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Create new course</h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Add course details, structure your content, and publish when ready.
                    </p>
                </div>

                {/* Main content */}
                <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    {/* Left: form */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-md">
                        <CourseComponent />
                    </div>

                    {/* Right: tips */}
                    <div className="h-fit rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-md">
                        <p className="mb-3 text-sm font-semibold text-yellow-300 flex items-center gap-2">
                            <span className="text-base">⚡</span>
                            <span>Course Upload Tips</span>
                        </p>

                        <ul className="space-y-2 text-xs text-slate-300">
                            <li className="leading-relaxed">
                                Set the course price or make it free so students know the cost.
                            </li>
                            <li className="leading-relaxed">
                                Use a thumbnail with a standard size of 1024x576 for best quality.
                            </li>
                            <li className="leading-relaxed">
                                The video section controls the course overview or promo video.
                            </li>
                            <li className="leading-relaxed">
                                Course builder is where you create and organize all course content.
                            </li>
                            <li className="leading-relaxed">
                                Add topics in course builder to create lessons, quizzes, and assignments.
                            </li>
                            <li className="leading-relaxed">
                                Additional data section appears on the course public details page.
                            </li>
                            <li className="leading-relaxed">
                                Use announcements to notify enrolled students about important updates.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;
