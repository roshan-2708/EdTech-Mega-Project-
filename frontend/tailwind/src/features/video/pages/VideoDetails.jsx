import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Player, BigPlayButton } from 'video-react';
import 'video-react/dist/video-react.css';
import { markLectureAsComplete } from '../../courses/courseAPI';
import { updateCompletedLectures } from '../viewCourseSlice';
import { FiCheckCircle, FiRotateCcw, FiChevronLeft, FiChevronRight, FiFileText, FiPlay } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const ArcProgress = ({ value, max, size = 80 }) => {
    const pct = max > 0 ? value / max : 0;
    const r = 28;
    const circ = 2 * Math.PI * r;
    const stroke = circ * (1 - pct);

    return (
        <svg width={size} height={size} viewBox="0 0 64 64" className="drop-shadow-lg">
            <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
            </defs>
            <circle cx="32" cy="32" r={r} fill="none" stroke="#2c323f" strokeWidth="5" />
            <circle
                cx="32" cy="32" r={r}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={stroke}
                transform="rotate(-90 32 32)"
                style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1)' }}
            />
            <text x="32" y="36" textAnchor="middle" fill="#fef08a" fontSize="11" fontFamily="monospace" fontWeight="700">
                {Math.round(pct * 100)}%
            </text>
        </svg>
    );
};

const StatusBadge = ({ completed }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest border transition-all duration-300 ${completed
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
        {completed ? <FiCheckCircle className="text-xs" /> : <FiPlay className="text-xs" />}
        {completed ? 'Completed' : 'In Progress'}
    </span>
);

const NavBtn = ({ onClick, icon, label, variant = 'secondary', disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 disabled:opacity-40 overflow-hidden ${variant === 'primary'
                ? 'bg-yellow-50 hover:bg-yellow-100 text-richblack-900 shadow-lg shadow-yellow-50/10'
                : 'bg-richblack-800 hover:bg-richblack-700 text-richblack-200 border border-richblack-700'
            }`}
    >
        <span className="relative z-10 flex items-center gap-1.5">
            {icon}
            {label}
        </span>
    </button>
);

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

    const ifFirstVideo = useCallback(() => {
        const si = courseSectionData.findIndex(s => s._id === sectionId);
        if (si === -1) return false;
        const subi = courseSectionData[si]?.subSection?.findIndex(s => s._id === subSectionId);
        return si === 0 && subi === 0;
    }, [courseSectionData, sectionId, subSectionId]);

    const ifLastVideo = useCallback(() => {
        const si = courseSectionData.findIndex(s => s._id === sectionId);
        if (si === -1) return true;
        const subi = courseSectionData[si]?.subSection?.findIndex(s => s._id === subSectionId);
        return si === courseSectionData.length - 1 &&
            subi === (courseSectionData[si]?.subSection?.length - 1 || 0);
    }, [courseSectionData, sectionId, subSectionId]);

    const goToNextVideo = useCallback(() => {
        const si = courseSectionData.findIndex(s => s._id === sectionId);
        if (si === -1) return;
        const cs = courseSectionData[si];
        const subi = cs?.subSection?.findIndex(s => s._id === subSectionId);
        if (subi < (cs?.subSection?.length - 1 || 0)) {
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${cs.subSection[subi + 1]._id}`);
        } else if (si < courseSectionData.length - 1) {
            const ns = courseSectionData[si + 1];
            navigate(`/view-course/${courseId}/section/${ns._id}/sub-section/${ns.subSection[0]._id}`);
        }
    }, [courseSectionData, courseId, sectionId, subSectionId, navigate]);

    const goToPrevVideo = useCallback(() => {
        const si = courseSectionData.findIndex(s => s._id === sectionId);
        if (si === -1) return;
        const cs = courseSectionData[si];
        const subi = cs?.subSection?.findIndex(s => s._id === subSectionId);
        if (subi > 0) {
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${cs.subSection[subi - 1]._id}`);
        } else if (si > 0) {
            const ps = courseSectionData[si - 1];
            navigate(`/view-course/${courseId}/section/${ps._id}/sub-section/${ps.subSection.slice(-1)[0]._id}`);
        }
    }, [courseSectionData, courseId, sectionId, subSectionId, navigate]);

    const handleLectureCompletion = useCallback(async () => {
        if (!subSectionId || completedLectures.includes(subSectionId)) return;
        setLoading(true);
        try {
            const res = await markLectureAsComplete({ courseId, subSectionId }, token);
            if (res) dispatch(updateCompletedLectures(subSectionId));
        } catch (err) {
            console.error('Mark complete error:', err);
        } finally {
            setLoading(false);
        }
    }, [subSectionId, courseId, token, completedLectures, dispatch]);

    const handleRewatch = useCallback(() => {
        if (playerRef.current) { playerRef.current.seek(0); playerRef.current.play(); }
        setVideoEnded(false);
    }, []);

    useEffect(() => {
        if (!courseSectionData.length || !sectionId || !subSectionId) return;
        const section = courseSectionData.find(s => s._id === sectionId);
        const video = section?.subSection?.find(sub => sub._id === subSectionId);
        setVideoData(video || null);
        setVideoEnded(false);
    }, [courseSectionData, sectionId, subSectionId]);

    if (!courseEntireData || courseSectionData.length === 0) {
        return (
            <div className="bg-richblack-900 w-full flex items-center justify-center h-screen select-none">
                <div className="text-center space-y-4">
                    <div className="w-10 h-10 border-4 border-yellow-50/20 border-t-yellow-50 rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-richblack-300 tracking-wider">Initialising player modules...</p>
                </div>
            </div>
        );
    }

    if (!videoData) {
        return (
            <div className="bg-richblack-900 w-full flex items-center justify-center h-screen select-none">
                <p className="text-xs text-richblack-300 tracking-wider animate-pulse">Streaming video data...</p>
            </div>
        );
    }

    const totalLectures = courseSectionData.reduce((sum, s) => sum + (s.subSection?.length || 0), 0);
    const isCompleted = completedLectures.includes(subSectionId);

    return (
        <div className="bg-richblack-900 text-richblack-5 overflow-y-auto h-screen select-none w-full relative">
            <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6">
                
                {/* Header Breadcrumb */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-richblack-300">
                        <span className="text-richblack-200 font-medium">{courseEntireData?.courseName || 'Course'}</span>
                        <span>/</span>
                        <span className="text-yellow-50 font-semibold truncate max-w-[200px]">{videoData.title}</span>
                    </div>
                    <StatusBadge completed={isCompleted} />
                </div>

                {/* Video Stage */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-50/20 to-transparent rounded-2xl blur-xl opacity-30 pointer-events-none" />
                    <div className="relative rounded-2xl overflow-hidden border border-richblack-700 bg-black shadow-2xl">
                        <Player
                            ref={playerRef}
                            aspectRatio="16:9"
                            playsInline
                            onEnded={() => setVideoEnded(true)}
                            src={videoData.videoUrl}
                        >
                            <BigPlayButton position="center" />
                        </Player>

                        {videoEnded && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-richblack-900/90 backdrop-blur-md">
                                <div className="flex flex-col items-center gap-5 w-full max-w-[360px] p-6 bg-richblack-800 border border-richblack-700 rounded-md shadow-2xl">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-yellow-50/10 border border-yellow-50/20 text-yellow-50 shadow-lg">
                                        <HiSparkles className="text-2xl" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <h3 className="text-lg font-bold text-richblack-5">Lecture Complete</h3>
                                        <p className="text-xs text-richblack-300">Choose your next action below</p>
                                    </div>

                                    <div className="flex items-center gap-4 w-full p-3 bg-richblack-900/60 border border-richblack-700 rounded-md">
                                        <ArcProgress value={completedLectures.length + (isCompleted ? 0 : 1)} max={totalLectures} />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] text-richblack-400 font-semibold uppercase tracking-wider">Overall Progress</p>
                                            <p className="text-lg font-mono font-bold text-richblack-5">
                                                {completedLectures.length + (isCompleted ? 0 : 1)} <span className="text-xs text-richblack-400 font-normal">/ {totalLectures}</span>
                                            </p>
                                            <p className="text-[10px] text-richblack-400">lectures done</p>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-2.5">
                                        {!isCompleted && (
                                            <button
                                                disabled={loading}
                                                onClick={handleLectureCompletion}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md text-xs font-bold bg-yellow-50 hover:bg-yellow-100 text-richblack-900 shadow-lg shadow-yellow-50/10 transition-all cursor-pointer"
                                            >
                                                <FiCheckCircle className="text-sm" />
                                                <span>{loading ? 'Saving…' : 'Mark as Completed'}</span>
                                            </button>
                                        )}
                                        <button 
                                            onClick={handleRewatch} 
                                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md text-xs font-semibold bg-richblack-700 hover:bg-richblack-600 text-richblack-200 border border-richblack-600 transition-all cursor-pointer"
                                        >
                                            <FiRotateCcw className="text-sm" /> Rewatch Lecture
                                        </button>
                                    </div>

                                    <div className="flex w-full gap-2.5">
                                        {!ifFirstVideo() && (
                                            <button onClick={goToPrevVideo} className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-richblack-700 hover:bg-richblack-600 text-richblack-200 text-xs rounded-lg border border-richblack-600 transition-all">
                                                <FiChevronLeft /> Previous
                                            </button>
                                        )}
                                        {!ifLastVideo() && (
                                            <button onClick={goToNextVideo} className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-yellow-50/10 hover:bg-yellow-50/20 text-yellow-50 text-xs rounded-lg border border-yellow-50/30 font-semibold transition-all">
                                                Next <FiChevronRight />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                    <div className="lg:col-span-2 space-y-4">
                        <h1 className="text-2xl font-extrabold text-richblack-5 tracking-tight">{videoData.title}</h1>
                        <div className="p-4 bg-richblack-800 border border-richblack-700 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-[10px] uppercase font-bold text-richblack-400 tracking-wider">Course Progress</span>
                                <span className="font-mono font-semibold text-yellow-50">{completedLectures.length} / {totalLectures} lectures</span>
                            </div>
                            <div className="w-full h-1.5 bg-richblack-900 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-600 via-yellow-50 to-yellow-100 rounded-full transition-all duration-500" style={{ width: `${(completedLectures.length / totalLectures) * 100}%` }} />
                            </div>
                        </div>
                    </div>

                    {!videoEnded && (
                        <div className="flex gap-2.5 lg:justify-end items-center lg:pt-2">
                            {!ifFirstVideo() && (
                                <NavBtn onClick={goToPrevVideo} icon={<FiChevronLeft />} label="Prev" variant="secondary" />
                            )}
                            {!ifLastVideo() && (
                                <NavBtn onClick={goToNextVideo} icon={<FiChevronRight />} label="Next" variant="primary" />
                            )}
                        </div>
                    )}
                </div>

                {videoData.description && (
                    <div className="relative rounded-2xl border border-richblack-700 bg-richblack-800/80 overflow-hidden shadow-lg">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-50" />
                        <div className="p-6 pl-8">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-yellow-50/10 border border-yellow-50/20 flex items-center justify-center">
                                    <FiFileText className="text-yellow-50 text-sm" />
                                </div>
                                <h3 className="text-sm font-bold text-richblack-5 tracking-wide">Lecture Notes</h3>
                            </div>
                            <p className="text-xs text-richblack-300 leading-relaxed whitespace-pre-wrap">{videoData.description}</p>
                        </div>
                    </div>
                )}
                <div className="h-8" />
            </div>
        </div>
    );
};

export default VideoDetails;