import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
    const safeCourses = Array.isArray(courses) ? courses : [];
    const [currChart, setCurrChart] = useState("students");

    const getRandomColors = (numColors) => {
        const colors = [
            'rgb(99, 102, 241)',   // indigo
            'rgb(16, 185, 129)',   // emerald
            'rgb(245, 158, 11)',   // amber
            'rgb(168, 85, 247)',   // violet
            'rgb(59, 130, 246)',   // blue
            'rgb(239, 68, 68)',    // red
            'rgb(34, 197, 94)',    // green
            'rgb(251, 146, 60)'    // orange
        ];
        return Array.from({ length: numColors }, (_, i) => colors[i % colors.length]);
    };

    if (safeCourses.length === 0) {
        return (
            <div className="flex items-center justify-center h-80 bg-slate-800 rounded-2xl border border-slate-700 p-8">
                <p className="text-slate-400 text-lg font-medium">No chart data available</p>
            </div>
        );
    }

    const chartDataForStudents = {
        labels: safeCourses.map(c => c.courseName),
        datasets: [{
            data: safeCourses.map(c => c.totalStudentsEnrolled || 0),
            backgroundColor: getRandomColors(safeCourses.length),
            borderWidth: 2,
            borderColor: '#374151', // gray-700
        }],
    };

    const chartDataForIncome = {
        labels: safeCourses.map(c => c.courseName),
        datasets: [{
            data: safeCourses.map(c => c.totalAmountGenerated || 0),
            backgroundColor: getRandomColors(safeCourses.length),
            borderWidth: 2,
            borderColor: '#374151', // gray-700
        }],
    };

    return (
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Analytics Overview</h2>
                    <p className="text-slate-400 mt-2 text-lg">Visualize your courses performance</p>
                </div>
                <div className="flex gap-2 bg-slate-700 p-2 rounded-xl">
                    <button
                        onClick={() => setCurrChart("students")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 ${currChart === "students"
                                ? "bg-yellow-400 text-white"
                                : "text-slate-300 hover:bg-slate-600 hover:text-white"
                            }`}
                    >
                        Students
                    </button>
                    <button
                        onClick={() => setCurrChart("income")}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 ${currChart === "income"
                                ? "bg-yellow-400 text-white"
                                : "text-slate-300 hover:bg-slate-600 hover:text-white"
                            }`}
                    >
                        Income
                    </button>
                </div>
            </div>
            <div className="bg-slate-900 rounded-xl p-8 border border-slate-700 h-96 flex items-center justify-center">
                <Pie
                    data={currChart === "students" ? chartDataForStudents : chartDataForIncome}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    usePointStyle: true,
                                    font: {
                                        size: 13,
                                        weight: '500'
                                    },
                                    color: '#9ca3af', // gray-400
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default InstructorChart;
