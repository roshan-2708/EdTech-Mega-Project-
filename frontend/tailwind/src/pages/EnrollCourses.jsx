import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from "../services/operations/profileAPI";

const EnrollCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = useCallback(async () => {
        try {
            const courses = await getUserEnrolledCourses(token);
            setEnrolledCourses(courses);
        } catch (error) {
            console.error(error);
            setEnrolledCourses([]);
        }
    }, [token]);

    useEffect(() => {
        getEnrolledCourses();
    }, [getEnrolledCourses]);

    return (
        <div className='text-white'>
            <h1 className="text-2xl mb-4">Enrolled Courses</h1>

            {!enrolledCourses ? (
                <div>Loading...</div>
            ) : !enrolledCourses.length ? (
                <p>You have not enrolled in any courses.</p>
            ) : (
                <div>
                    <div className="flex justify-between mb-3">
                        <p>Course Name</p>
                        <p>Duration</p>
                        <p>Progress</p>
                    </div>

                    {enrolledCourses.map((course, idx) => (
                        <div key={idx} className="flex justify-between items-center mb-4">
                            <div className="flex gap-4">
                                <img
                                    src={course.thumbnail}
                                    alt="course"
                                    className="w-20 h-12 object-cover"
                                />
                                <div>
                                    <p>{course.courseName}</p>
                                    <p className="text-sm text-gray-400">
                                        {course.courseDescription}
                                    </p>
                                </div>
                            </div>

                            <div>{course.totalDuration}</div>

                            <div className="w-40">
                                <p className="text-sm mb-1">
                                    Progress : {course.progressPercentage || 0}%
                                </p>
                                <ProgressBar
                                    completed={course.progressPercentage || 0}
                                    height="8px"
                                    isLabelVisible={false}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrollCourses;
