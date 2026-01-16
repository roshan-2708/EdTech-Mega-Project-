import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '../components/common/IconButton';

const VideoDetailsSideBar = ({ setReviewModal }) => {
    const [activeSection, setActiveSection] = useState('');
    const [activeSubSection, setActiveSubSection] = useState('');

    const navigate = useNavigate();
    const { sectionId, subSectionId } = useParams();

    // ✅ Redux selectors
    const completedLectures = useSelector(
        state => state.viewCourse.completedLectures,
        shallowEqual
    );
    const courseSectionData = useSelector(
        state => state.viewCourse.courseSectionData,
        shallowEqual
    );
    const courseEntireData = useSelector(
        state => state.viewCourse.courseEntireData
    );
    const totalNoOfLectures = useSelector(
        state => state.viewCourse.totalNoOfLectures
    );
    const isCourseLoading = useSelector(
        state => state.viewCourse.isCourseLoading
    );
    const isProgressLoading = useSelector(
        state => state.viewCourse.isProgressLoading
    );

    // ✅ Set active section / subsection from URL
    useEffect(() => {
        if (sectionId) {
            setActiveSection(sectionId);
        } else if (courseSectionData.length > 0) {
            setActiveSection(courseSectionData[0]._id);
        }

        if (subSectionId) {
            setActiveSubSection(subSectionId);
        } else {
            setActiveSubSection('');
        }
    }, [sectionId, subSectionId, courseSectionData]);

    // ✅ Auto open first subsection
    useEffect(() => {
        if (activeSection && !activeSubSection) {
            const section = courseSectionData.find(
                s => s._id === activeSection
            );
            if (section?.subSection?.length > 0) {
                setActiveSubSection(section.subSection[0]._id);
            }
        }
    }, [activeSection, activeSubSection, courseSectionData]);

    const handleNavigate = (secId, subId) => {
        if (!courseEntireData?._id) return;

        setActiveSection(secId);
        setActiveSubSection(subId);

        navigate(
            `/view-course/${courseEntireData._id}/section/${secId}/sub-section/${subId}`
        );
    };

    // ✅ Correct loading guard (IMPORTANT)
    if (isCourseLoading || isProgressLoading) {
        return (
            <div className="w-80 bg-richblack-900 flex items-center justify-center text-white">
                Loading course progress...
            </div>
        );
    }

    if (!courseEntireData || courseSectionData.length === 0) {
        return (
            <div className="w-80 bg-richblack-900 flex items-center justify-center text-white">
                Loading sidebar...
            </div>
        );
    }

    return (
        <div className="w-80 bg-richblack-900 p-6 flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-richblack-700">
                <div className="flex gap-3">
                    <IconButton
                        text="Back"
                        onClick={() => navigate('/dashboard/enrolled-courses')}
                        customClasses="!w-24 bg-richblack-700 hover:bg-richblack-600"
                    />
                    <IconButton
                        text="Add Review"
                        onClick={() => setReviewModal(true)}
                        customClasses="flex-1"
                    />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {courseEntireData.courseName}
                    </h1>
                    <p className="text-richblack-300">
                        {completedLectures.length} / {totalNoOfLectures} lectures
                    </p>
                </div>
            </div>

            {/* Sections */}
            <div className="flex-1 overflow-auto">
                {courseSectionData.map(section => (
                    <div key={section._id} className="mb-6">
                        {/* Section Header */}
                        <div
                            className={`p-4 rounded-xl cursor-pointer transition-all mb-3 ${activeSection === section._id
                                    ? 'bg-yellow-500/20 border-2 border-yellow-500'
                                    : 'bg-richblack-800 hover:bg-richblack-700 border border-richblack-700'
                                }`}
                            onClick={() => {
                                setActiveSection(section._id);
                                setActiveSubSection('');
                            }}
                        >
                            <span className="font-semibold text-white">
                                {section.sectionName}
                            </span>
                        </div>

                        {/* Subsections */}
                        {activeSection === section._id && (
                            <div className="ml-4 space-y-2">
                                {section.subSection?.map(sub => {
                                    const isCompleted = completedLectures.some(
                                        id => String(id) === String(sub._id)
                                    );

                                    return (
                                        <div
                                            key={sub._id}
                                            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${activeSubSection === sub._id
                                                    ? 'bg-yellow-200 text-richblack-900 font-semibold shadow-md'
                                                    : 'bg-richblack-800 hover:bg-richblack-700 text-white border border-richblack-700'
                                                }`}
                                            onClick={() =>
                                                handleNavigate(
                                                    section._id,
                                                    sub._id
                                                )
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isCompleted}
                                                readOnly
                                                className="w-4 h-4 text-yellow-500 rounded border-gray-300"
                                            />
                                            <span className="flex-1 py-1">
                                                {sub.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoDetailsSideBar;
