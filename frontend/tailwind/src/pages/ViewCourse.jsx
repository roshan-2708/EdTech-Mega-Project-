

import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFullCourseDetails } from '../services/operations/courseAPI';
import {
    setCourseSectionData,
    setEntireCourseData,
    setCompletedLectures,
    setTotalNoOfLectures,
} from '../slice/viewCourseSlice';
import VideoDetailsSideBar from './VideoDetailsSideBar';
import CourseReviewModal from './CourseReviewModal';
const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(false);
    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const viewCourse = useSelector((state) => state.viewCourse);

    // ✅ HOOKS ALWAYS RUN
    useEffect(() => {
        if (!viewCourse || !courseId || !token) return;

        const fetchCourseDetails = async () => {
            try {
                const courseData = await getFullCourseDetails(courseId, token);

                const totalLectures = (courseData.courseContent ?? []).reduce(
                    (sum, sec) => sum + (sec.subSection?.length ?? 0),
                    0
                );

                dispatch(setCourseSectionData(courseData.courseContent ?? []));
                dispatch(setCompletedLectures(courseData.completedVideos ?? []));
                dispatch(setTotalNoOfLectures(totalLectures));
                dispatch(setEntireCourseData(courseData));
            } catch (error) {
                console.error("❌ Course load error:", error);
            }
        };

        fetchCourseDetails();
    }, [viewCourse, courseId, token, dispatch]);

    // ✅ CONDITIONAL RENDER AFTER HOOKS
    if (!viewCourse) {
        return (
            <div style={{ color: "red", padding: "20px" }}>
                ❌ viewCourse reducer NOT found in Redux store
            </div>
        );
    }

    const { courseEntireData } = viewCourse;

    if (!courseEntireData) {
        return <div className="text-white">Loading course...</div>;
    }

    return (
        <div className="flex h-screen bg-richblack-900 overflow-hidden">
            <VideoDetailsSideBar setReviewModal={setReviewModal} />
            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
            {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
        </div>
    );
};



export default ViewCourse;
