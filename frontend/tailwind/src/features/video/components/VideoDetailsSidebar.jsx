import React, { useEffect, useState, useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FiChevronDown, FiArrowLeft, FiStar, FiPlay, FiCheck, FiSearch } from "react-icons/fi";

const VideoDetailsSideBar = ({ setReviewModal }) => {
    const navigate = useNavigate();
    const { sectionId, subSectionId } = useParams();

    const completedLectures = useSelector(s => s.viewCourse.completedLectures, shallowEqual);
    const courseSectionData = useSelector(s => s.viewCourse.courseSectionData, shallowEqual);
    const courseEntireData  = useSelector(s => s.viewCourse.courseEntireData);
    const totalNoOfLectures = useSelector(s => s.viewCourse.totalNoOfLectures);
    const isCourseLoading   = useSelector(s => s.viewCourse.isCourseLoading);
    const isProgressLoading = useSelector(s => s.viewCourse.isProgressLoading);

    const [activeSection, setActiveSection] = useState('');
    const [activeSubSection, setActiveSubSection] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setActiveSection(sectionId || (courseSectionData[0]?._id ?? ''));
        setActiveSubSection(subSectionId || '');
    }, [sectionId, subSectionId, courseSectionData]);

    useEffect(() => {
        if (activeSection && !activeSubSection) {
            const sec = courseSectionData.find(s => s._id === activeSection);
            if (sec?.subSection?.length) setActiveSubSection(sec.subSection[0]._id);
        }
    }, [activeSection, activeSubSection, courseSectionData]);

    // Filter sections and subsections based on search query
    const filteredSections = useMemo(() => {
        if (!searchQuery.trim()) return courseSectionData;
        const q = searchQuery.toLowerCase();
        return courseSectionData.map(sec => ({
            ...sec,
            subSection: sec.subSection?.filter(sub => sub.title.toLowerCase().includes(q))
        })).filter(sec => sec.subSection.length > 0 || sec.sectionName.toLowerCase().includes(q));
    }, [courseSectionData, searchQuery]);

    if (isCourseLoading || isProgressLoading || !courseEntireData || courseSectionData.length === 0) {
        return (
            <div className="w-[320px] min-w-[320px] h-screen bg-richblack-900 border-r border-richblack-700 flex flex-col items-center justify-center gap-3 text-richblack-300">
                <div className="w-7 h-7 border-2 border-yellow-50/20 border-t-yellow-50 rounded-full animate-spin" />
                <p className="text-xs tracking-wider">Loading course content...</p>
            </div>
        );
    }

    const completedCount = completedLectures.length;
    const pct = totalNoOfLectures > 0 ? Math.round((completedCount / totalNoOfLectures) * 100) : 0;

    return (
        <div className="w-[320px] min-w-[320px] h-screen bg-richblack-900 border-r border-richblack-700 flex flex-col select-none text-richblack-5">
            
            {/* Header */}
            <div className="p-4 bg-richblack-800/90 backdrop-blur-md border-b border-richblack-700 flex-shrink-0 relative">
                <div className="flex items-center justify-between mb-3">
                    <button 
                        onClick={() => navigate('/dashboard/enrolled-courses')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-richblack-700 text-richblack-200 border border-richblack-600 rounded-lg hover:bg-richblack-600 hover:text-white transition-all cursor-pointer"
                    >
                        <FiArrowLeft /> Back
                    </button>
                    <button 
                        onClick={() => setReviewModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-yellow-50 text-richblack-900 rounded-lg shadow-lg shadow-yellow-50/10 hover:bg-yellow-100 transition-all cursor-pointer"
                    >
                        <FiStar className="text-[10px]" /> Review
                    </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-richblack-5 tracking-tight">Course Content</h2>
                    <span className="text-[11px] text-richblack-300 font-mono">({courseSectionData.length} Sections)</span>
                </div>

                {/* Search Bar */}
                <div className="relative mb-3">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-richblack-400 text-xs" />
                    <input 
                        type="text"
                        placeholder="Search lectures, code, quizzes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-richblack-900 border border-richblack-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-richblack-5 placeholder-richblack-400 focus:outline-none focus:border-yellow-50 transition-colors"
                    />
                </div>

                {/* Progress Bar Info */}
                <div className="p-3 bg-richblack-900/60 border border-richblack-700/80 rounded-xl">
                    <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
                        <span className="text-[10px] text-richblack-400 uppercase tracking-wider font-semibold">Course Progress</span>
                        <span className="text-yellow-50 font-bold">{completedCount} / {totalNoOfLectures} lectures</span>
                    </div>
                    <div className="w-full h-1.5 bg-richblack-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-600 via-yellow-50 to-yellow-100 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                </div>
            </div>

            {/* Sections Scroll List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-richblack-700">
                {filteredSections.map((section, si) => {
                    const isOpen = activeSection === section._id || searchQuery.length > 0;
                    const sectionDone = section.subSection?.filter(sub => completedLectures.includes(sub._id)).length ?? 0;
                    const sectionTotal = section.subSection?.length ?? 0;

                    return (
                        <div key={section._id} className={`rounded-xl border transition-all ${isOpen ? 'border-yellow-50/30 bg-yellow-50/[0.02]' : 'border-richblack-700/60 bg-richblack-800/40'}`}>
                            
                            {/* Section Accordion Toggle */}
                            <button
                                onClick={() => setActiveSection(prev => prev === section._id ? '' : section._id)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-richblack-700/30 transition-colors cursor-pointer"
                            >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${isOpen ? 'bg-yellow-50/20 text-yellow-50 border-yellow-50/40' : 'bg-richblack-700 text-richblack-300 border-richblack-600'}`}>
                                    {si + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-semibold truncate ${isOpen ? 'text-richblack-5' : 'text-richblack-200'}`}>{section.sectionName}</p>
                                    <p className="text-[10px] text-richblack-400 font-mono">{sectionDone}/{sectionTotal} done</p>
                                </div>
                                <FiChevronDown className={`text-richblack-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-yellow-50' : ''}`} />
                            </button>

                            {/* SubSections */}
                            {isOpen && (
                                <div className="px-2 pb-2 space-y-1">
                                    {section.subSection?.map((sub) => {
                                        const isCompleted = completedLectures.includes(sub._id);
                                        const isActive = activeSubSection === sub._id;

                                        return (
                                            <button
                                                key={sub._id}
                                                onClick={() => {
                                                    setActiveSection(section._id);
                                                    setActiveSubSection(sub._id);
                                                    navigate(`/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${sub._id}`);
                                                }}
                                                className={`w-full flex items-center gap-2.5 p-2.5 rounded-lg text-left transition-all relative cursor-pointer ${isActive ? 'bg-yellow-50/10 text-yellow-50' : 'hover:bg-richblack-700/40 text-richblack-300'}`}
                                            >
                                                {isActive && <div className="absolute left-0 top-1 bottom-1 w-1 bg-yellow-50 rounded-r" />}
                                                
                                                {/* Checkbox */}
                                                <div className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] transition-all ${isCompleted ? 'bg-caribbeangreen-200 border-caribbeangreen-200 text-richblack-900 shadow-sm shadow-caribbeangreen-200/30' : 'border-richblack-600 bg-richblack-900'}`}>
                                                    {isCompleted && <FiCheck className="stroke-[3]" />}
                                                </div>

                                                <span className={`text-xs flex-1 line-clamp-2 ${isActive ? 'font-semibold text-yellow-50' : 'text-richblack-200'}`}>
                                                    {sub.title}
                                                </span>

                                                {isActive && !isCompleted && (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-yellow-50/20 border border-yellow-50/30 text-yellow-50 rounded-full shrink-0">
                                                        <FiPlay className="text-[7px]" /> Now
                                                    </span>
                                                )}
                                                {isActive && isCompleted && (
                                                    <FiCheck className="text-caribbeangreen-200 text-xs shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VideoDetailsSideBar;