import React, { useState, useMemo } from "react";
import { Chart, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";

Chart.register(...registerables);

const InstructorChart = ({ courses }) => {
    // 1. Declare all hooks strictly at the top level
    const [currChart, setCurrChart] = useState("students");

    const safeCourses = useMemo(() => (Array.isArray(courses) ? courses : []), [courses]);

    // Re-designed theme-friendly charts palette
    const getChartColors = useMemo(() => {
        const colors = [
            'rgba(250, 204, 21, 0.85)',  // yellow-400
            'rgba(59, 130, 246, 0.85)',   // blue-500
            'rgba(16, 185, 129, 0.85)',  // emerald-500
            'rgba(168, 85, 247, 0.85)',  // violet-500
            'rgba(244, 63, 94, 0.85)',   // rose-500
            'rgba(249, 115, 22, 0.85)',  // orange-500
            'rgba(6, 182, 212, 0.85)'    // cyan-500
        ];
        return (numColors) => Array.from({ length: numColors }, (_, i) => colors[i % colors.length]);
    }, []);

    // Dynamic configuration generator
    const chartData = useMemo(() => {
        const isStudents = currChart === "students";
        return {
            labels: safeCourses.map(c => c.courseName),
            datasets: [{
                data: safeCourses.map(c => isStudents ? (c.totalStudentsEnrolled || 0) : (c.totalAmountGenerated || 0)),
                backgroundColor: getChartColors(safeCourses.length),
                borderWidth: 2,
                borderColor: '#0f172a', // slate-900 base border match
                hoverOffset: 12
            }],
        };
    }, [safeCourses, currChart, getChartColors]);

    // High performance configurations override
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 24,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 12,
                        weight: '500',
                        family: 'Inter, system-ui, sans-serif'
                    },
                    color: '#94a3b8', // slate-400
                }
            },
            tooltip: {
                backgroundColor: '#1e293b', // slate-800 tooltips
                titleColor: '#ffffff',
                bodyColor: '#f8fafc',
                borderColor: 'rgba(234, 179, 8, 0.2)', // yellow edge accent
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) label += ': ';
                        if (context.parsed !== undefined) {
                            label += currChart === 'students'
                                ? `${context.parsed} students`
                                : `₹${context.parsed.toLocaleString()}`;
                        }
                        return label;
                    }
                }
            }
        }
    };

    // 2. Perform early returns / conditional UI handling ONLY after hook registrations
    if (safeCourses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[340px] bg-slate-900/40 rounded-2xl border border-slate-800 p-8 text-center">
                <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
                <p className="text-slate-400 text-sm font-medium">No analytics data available right now</p>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col justify-between h-full space-y-6">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Revenue & Engagement</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Visualize your overall performance analytics</p>
                </div>

                {/* Clean Professional Tab Switcher */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit self-start sm:self-auto">
                    <button
                        onClick={() => setCurrChart("students")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${currChart === "students"
                                ? "bg-yellow-400 text-slate-950 shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Students
                    </button>
                    <button
                        onClick={() => setCurrChart("income")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${currChart === "income"
                                ? "bg-yellow-400 text-slate-950 shadow-sm"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Income
                    </button>
                </div>
            </div>

            {/* Render Canvas Wrapper */}
            <div className="relative w-full h-[260px] md:h-[280px] flex items-center justify-center mt-auto">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
};

export default InstructorChart;