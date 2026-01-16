// import React, { useEffect, useState, useCallback } from "react";
// import { useSelector } from "react-redux";
// import ProgressBar from "@ramonak/react-progress-bar";
// import { getUserEnrolledCourses } from "../services/operations/profileAPI";
// import { useNavigate } from "react-router-dom";

// const EnrollCourses = () => {
//     const { token } = useSelector((state) => state.auth);
//     const [enrolledCourses, setEnrolledCourses] = useState(null);
//     const navigate = useNavigate();
//     const getEnrolledCourses = useCallback(async () => {
//         try {
//             const res = await getUserEnrolledCourses(token);
//             console.log("Enrolled courses data:", res); // Add this
//             setEnrolledCourses(res);
//         } catch (error) {
//             console.error(error);
//             setEnrolledCourses([]);
//         }
//     }, [token]);

//     useEffect(() => {
//         getEnrolledCourses();
//     }, [getEnrolledCourses]);

//     return (
//         <div className='text-white'>
//             <h1 className="text-2xl mb-4">Enrolled Courses</h1>

//             {!enrolledCourses ? (
//                 <div>Loading...</div>
//             ) : !enrolledCourses.length ? (
//                 <p>You have not enrolled in any courses.</p>
//             ) : (
//                 <div>
//                     <div className="flex justify-between mb-3">
//                         <p>Course Name</p>
//                         <p>Duration</p>
//                         <p>Progress</p>
//                     </div>

//                     {enrolledCourses.map((course, idx) => (
//                         <div key={idx} className="flex justify-between items-center mb-4">
//                             <div className="flex gap-4" onClick={
//                                 () => {
//                                     // navigate(
//                                     //     `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
//                                     // )
//                                     navigate(`/view-course/${course._id}`);
//                                 }
//                             }>
//                                 <img
//                                     src={course.thumbnail}
//                                     alt="course"
//                                     className="w-20 h-12 object-cover"
//                                 />
//                                 <div>
//                                     <p>{course.courseName}</p>
//                                     <p className="text-sm text-gray-400">
//                                         {course.courseDescription}
//                                     </p>
//                                 </div>
//                             </div>

//                             <div>{course.totalDuration}</div>

//                             <div className="w-40">
//                                 <p className="text-sm mb-1">
//                                     Progress : {course.progressPercentage || 0}%
//                                 </p>
//                                 <ProgressBar
//                                     completed={course.progressPercentage || 0}
//                                     height="8px"
//                                     isLabelVisible={false}
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EnrollCourses;


import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from "../services/operations/profileAPI";
import { useNavigate } from "react-router-dom";

const EnrollCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);
    const navigate = useNavigate();

    const getEnrolledCourses = useCallback(async () => {
        try {
            const res = await getUserEnrolledCourses(token);
            console.log("Enrolled courses data:", res);
            setEnrolledCourses(res);
        } catch (error) {
            console.error("Failed to fetch enrolled courses:", error);
            setEnrolledCourses([]);
        }
    }, [token]);

    useEffect(() => {
        getEnrolledCourses();
    }, [getEnrolledCourses]);

    const handleCourseClick = (course) => {
        // ✅ Navigate to FIRST section/subsection or course overview
        const firstSectionId = course.courseContent?.[0]?._id;
        const firstSubSectionId = course.courseContent?.[0]?.subSection?.[0]?._id;

        if (firstSectionId && firstSubSectionId) {
            navigate(`/view-course/${course._id}/section/${firstSectionId}/sub-section/${firstSubSectionId}`);
        } else {
            navigate(`/view-course/${course._id}`);
        }
    };

    if (!enrolledCourses) {
        return <div className="text-white text-center p-8">Loading...</div>;
    }

    return (
        <div className='text-white p-6'>
            <h1 className="text-2xl mb-6 font-bold">Enrolled Courses</h1>

            {!enrolledCourses.length ? (
                <p className="text-gray-400">You have not enrolled in any courses.</p>
            ) : (
                <div className="space-y-4">
                    {enrolledCourses.map((course) => (
                        <div
                            key={course._id}
                            className="flex items-center p-6 bg-gray-900 rounded-xl hover:bg-gray-800 cursor-pointer transition-all border border-gray-700 hover:border-gray-600"
                            onClick={() => handleCourseClick(course)}
                        >
                            <img src={course.thumbnail} alt={course.courseName} className="w-20 h-12 object-cover rounded-lg mr-4" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg mb-1 truncate">{course.courseName}</h3>
                                <p className="text-sm text-gray-400 truncate">{course.courseDescription}</p>
                            </div>
                            <div className="text-right ml-8">
                                <p className="text-sm text-gray-400 mb-2">{course.totalDuration}</p>
                                <div className="w-32">
                                    <ProgressBar
                                        completed={course.progressPercentage || 0}
                                        height="8px"
                                        bgColor="#10b981"
                                        baseBgColor="#374151"
                                    />
                                    <p className="text-xs mt-1">{course.progressPercentage || 0}%</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EnrollCourses;

