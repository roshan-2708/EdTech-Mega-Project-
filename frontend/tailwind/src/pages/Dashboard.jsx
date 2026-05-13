import React from "react";
import SideBar from "../components/core/HomePage/SideBar";
import { Outlet } from "react-router-dom";
import { FiBookOpen, FiClock, FiStar } from "react-icons/fi"; // Icons for stats

const Dashboard = () => {
    return (
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <SideBar />

            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto bg-richblack-900">
                <div className="mx-auto w-11/12 max-w-[1000px] py-10">

                    {/* Header Section */}
                    <header className="mb-8 flex flex-col gap-2">
                        <h1 className="text-3xl font-semibold text-richblack-5">
                            Welcome back, <span className="text-yellow-50">Roshan!</span> 👋
                        </h1>
                        <p className="text-richblack-400">
                            Here's what's happening with your learning today.
                        </p>
                    </header>

                    {/* Stats Overview Section (Quick Info) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 flex items-center gap-4">
                            <div className="bg-yellow-500/10 p-3 rounded-lg text-yellow-100 text-2xl">
                                <FiBookOpen />
                            </div>
                            <div>
                                <p className="text-richblack-400 text-sm">Enrolled Courses</p>
                                <h3 className="text-2xl font-bold text-richblack-5">12</h3>
                            </div>
                        </div>

                        <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 flex items-center gap-4">
                            <div className="bg-blue-500/10 p-3 rounded-lg text-blue-100 text-2xl">
                                <FiClock />
                            </div>
                            <div>
                                <p className="text-richblack-400 text-sm">Learning Hours</p>
                                <h3 className="text-2xl font-bold text-richblack-5">48h</h3>
                            </div>
                        </div>

                        <div className="bg-richblack-800 p-6 rounded-xl border border-richblack-700 flex items-center gap-4">
                            <div className="bg-caribbeangreen-500/10 p-3 rounded-lg text-caribbeangreen-100 text-2xl">
                                <FiStar />
                            </div>
                            <div>
                                <p className="text-richblack-400 text-sm">Achievements</p>
                                <h3 className="text-2xl font-bold text-richblack-5">5</h3>
                            </div>
                        </div>
                    </div>

                    {/* Main Dynamic Section */}
                    <div className="min-h-[400px] bg-richblack-800/40 p-6 rounded-2xl border border-richblack-700 backdrop-blur-sm">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;