import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import FormComponent from "./FormComponent";
import CourseBuilder from "./CourseBuilder";
import Publish from "./Publish";
const CourseComponent = () => {
    const { step } = useSelector((state) => state.course);

    const steps = [
        { id: 1, title: "Course Info" },
        { id: 2, title: "Course Builder" },
        { id: 3, title: "Publish" },
    ];

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between gap-4">
                {steps.map((item, index) => {
                    const isActive = step === item.id;
                    const isCompleted = step > item.id;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={item.id} className="flex items-center flex-1">
                            {/* Circle + label */}
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors
                    ${isCompleted
                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                            : isActive
                                                ? "bg-yellow-500 border-yellow-400 text-black"
                                                : "bg-slate-900 border-slate-600 text-slate-400"
                                        }`}
                                >
                                    {isCompleted ? <FaRegCheckCircle /> : item.id}
                                </div>
                                <p
                                    className={`mt-2 text-xs text-center ${isActive || isCompleted
                                        ? "text-slate-100"
                                        : "text-slate-500"
                                        }`}
                                >
                                    {item.title}
                                </p>
                            </div>

                            {/* Connector line */}
                            {!isLast && (
                                <div className="mx-2 flex-1">
                                    <div
                                        className={`h-[2px] w-full rounded-full transition-colors
                      ${step > item.id
                                                ? "bg-emerald-500"
                                                : step === item.id
                                                    ? "bg-yellow-500/80"
                                                    : "bg-slate-700"
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Optional: description text under stepper */}
            <p className="mt-4 text-xs text-slate-400">
                Step {step} of {steps.length} – complete all steps to publish your course.
            </p>

            {step === 1 && <FormComponent />}
            {step === 2 && <CourseBuilder />}
            {step === 3 && <Publish></Publish>}
        </div>
    );
};

export default CourseComponent;
