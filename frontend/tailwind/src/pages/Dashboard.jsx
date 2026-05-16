import React from "react";
import SideBar from "../components/core/HomePage/SideBar";
import { Outlet } from "react-router-dom";  

const Dashboard = () => {
    return (
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <SideBar />

            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto bg-richblack-900">
                <div className="mx-auto w-11/12 max-w-[1000px] py-10">

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