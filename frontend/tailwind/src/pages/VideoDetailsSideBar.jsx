import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '../components/common/IconButton';
import { FiChevronDown, FiArrowLeft, FiStar, FiPlay, FiCheck } from 'react-icons/fi';
import { HiOutlineBookOpen } from 'react-icons/hi2';

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** Animated tick checkbox */
const LectureCheckbox = ({ checked }) => (
    <span className={`vds-check ${checked ? 'vds-check--done' : ''}`}>
        {checked && (
            <svg viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="vds-tick">
                <path d="M1 4L3.5 6.5L9 1" stroke="#050709" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )}
    </span>
);

/** Compact arc progress ring */
const RingProgress = ({ value, max, size = 44 }) => {
    const pct = max > 0 ? value / max : 0;
    const r = 16, circ = 2 * Math.PI * r;
    return (
        <svg width={size} height={size} viewBox="0 0 40 40">
            <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
            <circle
                cx="20" cy="20" r={r}
                fill="none"
                stroke="url(#sideRing)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - pct)}
                transform="rotate(-90 20 20)"
                style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1)' }}
            />
            <defs>
                <linearGradient id="sideRing" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
            </defs>
            <text x="20" y="24" textAnchor="middle" fill="#fbbf24"
                fontSize="8" fontFamily="'DM Mono', monospace" fontWeight="600">
                {Math.round(pct * 100)}%
            </text>
        </svg>
    );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */

const VideoDetailsSideBar = ({ setReviewModal }) => {
    const [activeSection, setActiveSection] = useState('');
    const [activeSubSection, setActiveSubSection] = useState('');

    const navigate = useNavigate();
    const { sectionId, subSectionId } = useParams();

    const completedLectures  = useSelector(s => s.viewCourse.completedLectures,  shallowEqual);
    const courseSectionData  = useSelector(s => s.viewCourse.courseSectionData,   shallowEqual);
    const courseEntireData   = useSelector(s => s.viewCourse.courseEntireData);
    const totalNoOfLectures  = useSelector(s => s.viewCourse.totalNoOfLectures);
    const isCourseLoading    = useSelector(s => s.viewCourse.isCourseLoading);
    const isProgressLoading  = useSelector(s => s.viewCourse.isProgressLoading);

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

    const handleNavigate = (secId, subId) => {
        if (!courseEntireData?._id) return;
        setActiveSection(secId);
        setActiveSubSection(subId);
        navigate(`/view-course/${courseEntireData._id}/section/${secId}/sub-section/${subId}`);
    };

    const handleSectionClick = id =>
        setActiveSection(prev => (prev === id ? '' : id));

    /* ── Loading skeleton ───────── */
    if (isCourseLoading || isProgressLoading || !courseEntireData || courseSectionData.length === 0) {
        return (
            <div className="vds-shell flex flex-col items-center justify-center gap-4">
                <div className="vds-spinner" />
                <p className="vds-loading-text">
                    {isCourseLoading || isProgressLoading
                        ? 'Loading course…'
                        : 'Assembling sidebar…'}
                </p>
                <style>{styles}</style>
            </div>
        );
    }

    const pct = totalNoOfLectures > 0
        ? Math.round((completedLectures.length / totalNoOfLectures) * 100)
        : 0;

    return (
        <div className="vds-shell">

            {/* ── Header ─────────────────────────────── */}
            <div className="vds-header">
                {/* Decorative top glow */}
                <div className="vds-header-glow" />

                {/* Action row */}
                <div className="vds-action-row">
                    <button className="vds-back-btn" onClick={() => navigate('/dashboard/enrolled-courses')}>
                        <FiArrowLeft className="text-sm" />
                        <span>Back</span>
                    </button>
                    <button className="vds-review-btn" onClick={() => setReviewModal(true)}>
                        <FiStar className="text-xs" />
                        <span>Review</span>
                    </button>
                </div>

                {/* Course title */}
                <h1 className="vds-course-title">{courseEntireData.courseName}</h1>

                {/* Progress row */}
                <div className="vds-progress-row">
                    <RingProgress value={completedLectures.length} max={totalNoOfLectures} />
                    <div className="vds-progress-text">
                        <div className="vds-progress-fraction">
                            <span className="vds-frac-done">{completedLectures.length}</span>
                            <span className="vds-frac-sep"> / {totalNoOfLectures}</span>
                        </div>
                        <p className="vds-progress-label">lectures completed</p>
                        {/* Bar */}
                        <div className="vds-bar-track">
                            <div className="vds-bar-fill" style={{ width: `${pct}%` }} />
                            <div className="vds-bar-dot" style={{ left: `calc(${pct}% - 5px)` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Section list ──────────────────────── */}
            <div className="vds-list">
                {courseSectionData.map((section, si) => {
                    const isOpen = activeSection === section._id;
                    const sectionDone = section.subSection?.filter(
                        sub => completedLectures.some(id => String(id) === String(sub._id))
                    ).length ?? 0;
                    const sectionTotal = section.subSection?.length ?? 0;

                    return (
                        <div key={section._id} className={`vds-section ${isOpen ? 'vds-section--open' : ''}`}>

                            {/* Section header */}
                            <button
                                className={`vds-sec-header ${isOpen ? 'vds-sec-header--open' : ''}`}
                                onClick={() => handleSectionClick(section._id)}
                            >
                                {/* Index bubble */}
                                <span className={`vds-sec-idx ${isOpen ? 'vds-sec-idx--open' : ''}`}>
                                    {si + 1}
                                </span>

                                <div className="vds-sec-info">
                                    <span className="vds-sec-name">{section.sectionName}</span>
                                    <span className="vds-sec-meta">{sectionDone}/{sectionTotal} done</span>
                                </div>

                                <FiChevronDown className={`vds-chevron ${isOpen ? 'vds-chevron--open' : ''}`} />
                            </button>

                            {/* Sub-section list */}
                            {isOpen && (
                                <div className="vds-sub-list">
                                    {section.subSection?.map((sub, idx) => {
                                        const isCompleted = completedLectures.some(
                                            id => String(id) === String(sub._id)
                                        );
                                        const isActive = activeSubSection === sub._id;

                                        return (
                                            <button
                                                key={sub._id}
                                                className={`vds-sub-item ${isActive ? 'vds-sub-item--active' : ''} ${isCompleted ? 'vds-sub-item--done' : ''}`}
                                                onClick={() => handleNavigate(section._id, sub._id)}
                                                style={{ animationDelay: `${idx * 35}ms` }}
                                            >
                                                {/* Active left bar */}
                                                {isActive && <span className="vds-active-bar" />}

                                                <LectureCheckbox checked={isCompleted} />

                                                <div className="vds-sub-info">
                                                    <span className="vds-sub-title">{sub.title}</span>
                                                </div>

                                                {isActive && !isCompleted && (
                                                    <span className="vds-playing-pill">
                                                        <FiPlay className="text-[8px]" /> Now
                                                    </span>
                                                )}
                                                {isCompleted && isActive && (
                                                    <FiCheck className="text-emerald-400 text-xs flex-shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                <div className="h-6" />
            </div>

            <style>{styles}</style>
        </div>
    );
};

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

/* ── Shell ──────────────────────────────── */
.vds-shell {
    width: 300px;
    min-width: 300px;
    height: 100vh;
    background: #070a0e;
    border-right: 1px solid rgba(255,255,255,0.05);
    display: flex;
    flex-direction: column;
    font-family: 'Instrument Sans', sans-serif;
    position: relative;
    overflow: hidden;
    select-none: true;
}

/* ── Header ─────────────────────────────── */
.vds-header {
    position: relative;
    padding: 1.25rem 1rem 1rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    background: rgba(10,12,18,0.9);
    backdrop-filter: blur(12px);
    flex-shrink: 0;
    z-index: 2;
}

.vds-header-glow {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 80px;
    background: radial-gradient(ellipse 80% 100% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 100%);
    pointer-events: none;
}

/* ── Action row ─────────────────────────── */
.vds-action-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.vds-back-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.45rem 0.875rem;
    font-size: 0.72rem;
    font-weight: 600;
    font-family: 'Instrument Sans', sans-serif;
    letter-spacing: 0.03em;
    background: rgba(255,255,255,0.04);
    color: #9ca3af;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 0.625rem;
    cursor: pointer;
    transition: all 0.2s;
}
.vds-back-btn:hover {
    background: rgba(255,255,255,0.07);
    color: #e5e7eb;
    transform: translateX(-1px);
}

.vds-review-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.45rem 0.75rem;
    font-size: 0.72rem;
    font-weight: 700;
    font-family: 'Instrument Sans', sans-serif;
    letter-spacing: 0.04em;
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    color: #050709;
    border: none;
    border-radius: 0.625rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.2s;
    box-shadow: 0 4px 14px -4px rgba(245,158,11,0.3);
}
.vds-review-btn:hover {
    box-shadow: 0 6px 20px -4px rgba(245,158,11,0.45);
    transform: translateY(-1px);
}
.vds-review-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
}
.vds-review-btn:hover::after { transform: translateX(100%); }

/* ── Course title ───────────────────────── */
.vds-course-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: #f9fafb;
    letter-spacing: -0.02em;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 1rem;
}

/* ── Progress row ───────────────────────── */
.vds-progress-row {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.75rem;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 0.875rem;
}

.vds-progress-text { flex: 1; }

.vds-progress-fraction {
    font-family: 'DM Mono', monospace;
    line-height: 1;
    margin-bottom: 2px;
}
.vds-frac-done {
    font-size: 1rem;
    font-weight: 600;
    color: #fbbf24;
}
.vds-frac-sep {
    font-size: 0.7rem;
    color: #4b5563;
}

.vds-progress-label {
    font-size: 0.6rem;
    color: #4b5563;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.vds-bar-track {
    position: relative;
    height: 3px;
    background: rgba(255,255,255,0.05);
    border-radius: 99px;
    overflow: visible;
}
.vds-bar-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, #d97706, #f59e0b, #fbbf24);
    box-shadow: 0 0 6px rgba(245,158,11,0.4);
    transition: width 0.7s cubic-bezier(.4,0,.2,1);
}
.vds-bar-dot {
    position: absolute;
    top: 50%;
    width: 10px; height: 10px;
    transform: translateY(-50%);
    background: #fbbf24;
    border: 2px solid #070a0e;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(245,158,11,0.6);
    transition: left 0.7s cubic-bezier(.4,0,.2,1);
}

/* ── Section list scroll area ───────────── */
.vds-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.75rem 0.625rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    scrollbar-width: thin;
    scrollbar-color: #1a1f28 transparent;
}
.vds-list::-webkit-scrollbar { width: 4px; }
.vds-list::-webkit-scrollbar-track { background: transparent; }
.vds-list::-webkit-scrollbar-thumb { background: #1a1f28; border-radius: 99px; }

/* ── Section card ───────────────────────── */
.vds-section {
    border-radius: 0.875rem;
    border: 1px solid rgba(255,255,255,0.04);
    overflow: hidden;
    background: rgba(255,255,255,0.015);
    transition: border-color 0.2s;
}
.vds-section--open {
    border-color: rgba(245,158,11,0.12);
    background: rgba(245,158,11,0.02);
}

/* ── Section header button ──────────────── */
.vds-sec-header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 0.875rem;
    cursor: pointer;
    background: transparent;
    border: none;
    text-align: left;
    transition: background 0.15s;
}
.vds-sec-header:hover { background: rgba(255,255,255,0.03); }
.vds-sec-header--open { background: rgba(245,158,11,0.04); }

/* Index bubble */
.vds-sec-idx {
    width: 22px;
    height: 22px;
    min-width: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.62rem;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
    background: rgba(255,255,255,0.05);
    color: #6b7280;
    border: 1px solid rgba(255,255,255,0.07);
    transition: all 0.2s;
}
.vds-sec-idx--open {
    background: rgba(245,158,11,0.15);
    color: #fbbf24;
    border-color: rgba(245,158,11,0.25);
}

.vds-sec-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
}
.vds-sec-name {
    font-size: 0.78rem;
    font-weight: 600;
    color: #d1d5db;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.01em;
}
.vds-sec-header--open .vds-sec-name { color: #f9fafb; }

.vds-sec-meta {
    font-size: 0.6rem;
    color: #4b5563;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.04em;
}

.vds-chevron {
    font-size: 0.85rem;
    color: #4b5563;
    transition: transform 0.25s ease, color 0.15s;
    flex-shrink: 0;
}
.vds-chevron--open {
    transform: rotate(180deg);
    color: #f59e0b;
}

/* ── Sub-section list ───────────────────── */
.vds-sub-list {
    padding: 0 0.5rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

/* ── Sub-section item button ────────────── */
.vds-sub-item {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.6rem 0.625rem 0.6rem 0.75rem;
    border-radius: 0.625rem;
    cursor: pointer;
    background: transparent;
    border: none;
    text-align: left;
    transition: background 0.15s;
    animation: subFadeIn 0.2s ease both;
}
.vds-sub-item:hover { background: rgba(255,255,255,0.04); }

.vds-sub-item--active {
    background: rgba(245,158,11,0.07) !important;
}
.vds-sub-item--done .vds-sub-title { color: #4b5563; }

@keyframes subFadeIn {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
}

/* Active bar */
.vds-active-bar {
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 2.5px;
    background: linear-gradient(to bottom, #f59e0b, #fbbf24);
    border-radius: 99px;
    box-shadow: 0 0 6px rgba(245,158,11,0.5);
}

/* Sub info */
.vds-sub-info { flex: 1; min-width: 0; }
.vds-sub-title {
    font-size: 0.73rem;
    font-weight: 500;
    color: #9ca3af;
    letter-spacing: 0.01em;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.vds-sub-item--active .vds-sub-title { color: #fbbf24; font-weight: 600; }

/* Playing pill */
.vds-playing-pill {
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 2px 7px;
    background: rgba(245,158,11,0.12);
    border: 1px solid rgba(245,158,11,0.2);
    border-radius: 99px;
    font-size: 0.58rem;
    font-weight: 700;
    color: #fbbf24;
    letter-spacing: 0.04em;
    white-space: nowrap;
    flex-shrink: 0;
}

/* ── Custom checkbox ───────────────────── */
.vds-check {
    width: 16px;
    height: 16px;
    min-width: 16px;
    border-radius: 4px;
    border: 1.5px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.03);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s cubic-bezier(.4,0,.2,1);
    flex-shrink: 0;
}
.vds-check--done {
    background: linear-gradient(135deg, #10b981, #34d399);
    border-color: transparent;
    box-shadow: 0 0 8px rgba(16,185,129,0.35);
    animation: checkPop 0.3s cubic-bezier(.175,.885,.32,1.275) both;
}
@keyframes checkPop {
    0%   { transform: scale(0.6); }
    60%  { transform: scale(1.15); }
    100% { transform: scale(1); }
}
.vds-tick {
    width: 9px;
    height: 7px;
    animation: tickDraw 0.25s ease 0.1s both;
}
@keyframes tickDraw {
    from { stroke-dasharray: 20; stroke-dashoffset: 20; }
    to   { stroke-dasharray: 20; stroke-dashoffset: 0; }
}

/* ── Loading ─────────────────────────────── */
.vds-spinner {
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 2px solid rgba(245,158,11,0.12);
    border-top-color: #f59e0b;
    animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.vds-loading-text {
    font-size: 0.72rem;
    color: #4b5563;
    letter-spacing: 0.06em;
    font-family: 'Instrument Sans', sans-serif;
}
`;

export default VideoDetailsSideBar;