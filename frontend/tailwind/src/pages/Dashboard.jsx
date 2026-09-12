import React from "react";
import SideBar from "../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="relative flex flex-col min-h-[calc(100vh-3.5rem)] bg-richblack-900 text-richblack-5">
            {/* Main Dynamic Content Section (Added pb-24 so content doesn't get hidden behind bottom bar) */}
            <div className="flex-1 overflow-y-auto bg-richblack-900/95 p-4 md:p-8 pb-28 ">
                <div className="mx-auto max-w-6xl">
                    <Outlet />
                </div>
            </div>

            {/* Bottom Positioned Sidebar / Navigation Bar */}
            <SideBar />
        </div>
    );
};

export default Dashboard;