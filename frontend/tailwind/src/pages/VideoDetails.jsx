import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Player } from 'video-react';
import { CiPlay1 } from 'react-icons/ci';
import IconButton from '../components/common/IconButton';
import { markLectureAsComplete } from '../services/operations/courseAPI';
import { updateCompletedLectures } from '../slice/viewCourseSlice';

const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);

    const courseSectionData = useSelector(state => state.viewCourse?.courseSectionData || []);
    const courseEntireData = useSelector(state => state.viewCourse?.courseEntireData);
    const completedLectures = useSelector(state => state.viewCourse?.completedLectures || []);
    
    const [videoData, setVideoData] = useState(null);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);
    const playerRef = useRef();

    // ✅ ALL useCallback hooks at TOP LEVEL - FIXED ESLint errors
    const ifFirstVideo = useCallback(() => {
        const sectionIndex = courseSectionData.findIndex(s => s._id === sectionId);
        if (sectionIndex === -1) return false;
        const subIndex = courseSectionData[sectionIndex]?.subSection?.findIndex(s => s._id === subSectionId);
        return sectionIndex === 0 && subIndex === 0;
    }, [courseSectionData, sectionId, subSectionId]);

    const ifLastVideo = useCallback(() => {
        const sectionIndex = courseSectionData.findIndex(s => s._id === sectionId);
        if (sectionIndex === -1) return true;
        const subIndex = courseSectionData[sectionIndex]?.subSection?.findIndex(s => s._id === subSectionId);
        return sectionIndex === courseSectionData.length - 1 &&
            subIndex === (courseSectionData[sectionIndex]?.subSection?.length - 1 || 0);
    }, [courseSectionData, sectionId, subSectionId]);

    const goToNextVideo = useCallback(() => {
        const sectionIndex = courseSectionData.findIndex(s => s._id === sectionId);
        if (sectionIndex === -1) return;

        const currentSection = courseSectionData[sectionIndex];
        const subIndex = currentSection?.subSection?.findIndex(s => s._id === subSectionId);

        if (subIndex < (currentSection?.subSection?.length - 1 || 0)) {
            const nextSubId = currentSection.subSection[subIndex + 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubId}`);
        } else if (sectionIndex < courseSectionData.length - 1) {
            const nextSectionId = courseSectionData[sectionIndex + 1]._id;
            const nextSubId = courseSectionData[sectionIndex + 1].subSection[0]._id;
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubId}`);
        }
    }, [courseSectionData, courseId, sectionId, subSectionId, navigate]);

    const goToPrevVideo = useCallback(() => {
        const sectionIndex = courseSectionData.findIndex(s => s._id === sectionId);
        if (sectionIndex === -1 || sectionIndex === 0) return;

        const currentSection = courseSectionData[sectionIndex];
        const subIndex = currentSection?.subSection?.findIndex(s => s._id === subSectionId);

        if (subIndex > 0) {
            const prevSubId = currentSection.subSection[subIndex - 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubId}`);
        } else {
            const prevSectionId = courseSectionData[sectionIndex - 1]._id;
            const prevSubId = courseSectionData[sectionIndex - 1].subSection.slice(-1)[0]._id;
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubId}`);
        }
    }, [courseSectionData, courseId, sectionId, subSectionId, navigate]);

    
    const handleLectureCompletion = useCallback(async () => {
        if (!subSectionId || completedLectures.includes(subSectionId)) return;
        
        setLoading(true);
        try {
            const res = await markLectureAsComplete({ courseId, subSectionId }, token);
            if (res) {
                // ✅ PASS SINGLE ID (not array!) - reducer expects string
                dispatch(updateCompletedLectures(subSectionId));
            }
        } catch (err) {
            console.error('Mark complete error:', err);
        } finally {
            setLoading(false);
        }
    }, [subSectionId, courseId, token, completedLectures, dispatch]);


    const handleRewatch = useCallback(() => {
        if (playerRef.current) {
            playerRef.current.seek(0);
        }
        setVideoEnded(false);
    }, []);

    // Load video data
    useEffect(() => {
        if (!courseSectionData.length || !sectionId || !subSectionId) return;

        const currentSection = courseSectionData.find(sec => sec._id === sectionId);
        if (!currentSection) return;

        const currentVideo = currentSection.subSection?.find(sub => sub._id === subSectionId);
        setVideoData(currentVideo || null);
    }, [courseSectionData, sectionId, subSectionId]);

    // ✅ Early returns AFTER all hooks
    if (!courseEntireData || courseSectionData.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen text-white bg-richblack-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    Loading course...
                </div>
            </div>
        );
    }

    if (!videoData) {
        return (
            <div className="flex items-center justify-center h-screen text-white bg-richblack-900">
                Loading video...
            </div>
        );
    }

    // Total lectures count
    const totalLectures = courseSectionData.reduce((sum, sec) => sum + (sec.subSection?.length || 0), 0);

    return (
        <div className="flex-1 p-6 overflow-auto bg-richblack-900">
            {/* Video Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {videoData.title}
                </h1>
                <p className="text-richblack-200 text-sm md:text-base">
                    {videoData.description || 'No description available'}
                </p>
            </div>

            {/* Video Player */}
            <div className="bg-richblack-800 rounded-2xl p-4 md:p-6 mb-6">
                <Player
                    ref={playerRef}
                    aspectRatio="16:9"
                    playsInline
                    onEnded={() => setVideoEnded(true)}
                    src={videoData.videoUrl}
                >
                    <CiPlay1 />
                </Player>

                {/* Video Controls */}
                {videoEnded && (
                    <div className="mt-6 flex flex-col gap-4">
                        {/* Mark Complete Button */}
                        {!completedLectures.includes(subSectionId) && (
                            <IconButton
                                disabled={loading}
                                onClick={handleLectureCompletion}
                                text={loading ? 'Saving...' : '✅ Mark As Completed'}
                                customClasses="bg-yellow-500 hover:bg-yellow-400 text-richblack-900"
                            />
                        )}

                        {/* Rewatch Button */}
                        <IconButton
                            onClick={handleRewatch}
                            text="🔄 Rewatch"
                            customClasses="bg-richblack-700 hover:bg-richblack-600"
                        />

                        {/* Navigation Buttons */}
                        <div className="flex gap-3 pt-2">
                            {!ifFirstVideo() && (
                                <IconButton
                                    onClick={goToPrevVideo}
                                    text="⬅️ Previous"
                                    customClasses="flex-1 bg-richblack-700 hover:bg-richblack-600"
                                />
                            )}
                            {!ifLastVideo() && (
                                <IconButton
                                    onClick={goToNextVideo}
                                    text="Next ➡️"
                                    customClasses="flex-1 bg-yellow-500 hover:bg-yellow-400 text-richblack-900"
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Progress Indicator */}
            <div className="text-sm text-richblack-400 mb-4">
                Progress: {completedLectures.length} / {totalLectures} lectures
            </div>

            {/* Lecture Notes */}
            {videoData.description && (
                <div className="bg-richblack-800 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-2">📝 Lecture Notes:</h3>
                    <p className="text-richblack-200 text-sm">{videoData.description}</p>
                </div>
            )}
        </div>
    );
};

export default VideoDetails;

