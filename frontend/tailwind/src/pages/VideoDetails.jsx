import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Player, BigPlayButton } from 'video-react';
import 'video-react/dist/video-react.css';
import IconButton from '../components/common/IconButton';
import { markLectureAsComplete } from '../services/operations/courseAPI';
import { updateCompletedLectures } from '../slice/viewCourseSlice';
import { FiCheckCircle, FiRotateCcw, FiChevronLeft, FiChevronRight, FiFileText, FiPlay, FiLock } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

/* ─────────────────────────────────────────────
   Tiny sub-components (no external deps needed)
───────────────────────────────────────────── */

/** Animated arc-style radial progress */
const ArcProgress = ({ value, max, size = 80 }) => {
    const pct = max > 0 ? value / max : 0;
    const r = 28;
    const circ = 2 * Math.PI * r;
    const stroke = circ * (1 - pct);

    return (
        <svg width={size} height={size} viewBox="0 0 64 64" className="drop-shadow-lg">
            <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
            </defs>
            <circle cx="32" cy="32" r={r} fill="none" stroke="#1f2937" strokeWidth="5" />
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
            <text x="32" y="36" textAnchor="middle" fill="#f5f5f5" fontSize="11" fontFamily="'DM Mono', monospace" fontWeight="600">
                {Math.round(pct * 100)}%
            </text>
        </svg>
    );
};

/** Shimmer pill badge */
const StatusBadge = ({ completed }) => (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest border transition-all duration-300 ${completed
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
        {completed ? <FiCheckCircle className="text-xs" /> : <FiPlay className="text-xs" />}
        {completed ? 'Completed' : 'In Progress'}
    </span>
);

/** Glowing nav button */
const NavBtn = ({ onClick, icon, label, variant = 'secondary', disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 disabled:opacity-40 overflow-hidden ${variant === 'primary'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-white/20'
            }`}
    >
        <span className="relative z-10 flex items-center gap-1.5">
            {icon}
            {label}
        </span>
        {variant === 'primary' && (
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
    </button>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */

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
    const [mounted, setMounted] = useState(false);
    const playerRef = useRef();

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    // ── Navigation helpers (unchanged logic) ─────────────────────
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

    // ── Loading states ────────────────────────────────────────────
    if (!courseEntireData || courseSectionData.length === 0) {
        return (
            <div className="vd-shell flex items-center justify-center h-screen select-none">
                <div className="text-center space-y-4">
                    <div className="vd-spinner" />
                    <p className="vd-loading-text">Initialising player modules…</p>
                </div>
                <style>{sharedStyles}</style>
            </div>
        );
    }

    if (!videoData) {
        return (
            <div className="vd-shell flex items-center justify-center h-screen select-none">
                <p className="vd-loading-text vd-pulse">Streaming video data…</p>
                <style>{sharedStyles}</style>
            </div>
        );
    }

    const totalLectures = courseSectionData.reduce((sum, s) => sum + (s.subSection?.length || 0), 0);
    const isCompleted = completedLectures.includes(subSectionId);

    return (
        <div className={`vd-shell overflow-y-auto h-screen select-none vd-page-enter ${mounted ? 'vd-page-enter-active' : ''}`}>

            {/* ── Ambient background glow ── */}
            <div className="vd-ambient" />

            <div className="vd-content max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8 space-y-6">

                {/* ══ HEADER BREADCRUMB ══════════════════════════════════════ */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="text-slate-400 font-medium">{courseEntireData?.courseName || 'Course'}</span>
                        <span>/</span>
                        <span className="text-amber-400 font-semibold truncate max-w-[200px]">{videoData.title}</span>
                    </div>
                    <StatusBadge completed={isCompleted} />
                </div>

                {/* ══ VIDEO STAGE ════════════════════════════════════════════ */}
                <div className="vd-stage-wrap">
                    {/* Glow halo behind player */}
                    <div className="vd-glow-halo" />

                    <div className="vd-stage">
                        <Player
                            ref={playerRef}
                            aspectRatio="16:9"
                            playsInline
                            onEnded={() => setVideoEnded(true)}
                            src={videoData.videoUrl}
                        >
                            <BigPlayButton position="center" />
                        </Player>

                        {/* ── End-screen cinematic overlay ── */}
                        {videoEnded && (
                            <div className="vd-endscreen">
                                {/* Decorative grid lines */}
                                <div className="vd-grid-overlay" />

                                <div className="vd-endscreen-card">
                                    {/* Sparkle icon */}
                                    <div className="vd-sparkle-ring">
                                        <HiSparkles className="text-amber-400 text-2xl" />
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="vd-end-title">Lecture Complete</h3>
                                        <p className="vd-end-sub">Choose your next action</p>
                                    </div>

                                    {/* Progress sneak peek */}
                                    <div className="vd-end-progress-row">
                                        <ArcProgress value={completedLectures.length + (isCompleted ? 0 : 1)} max={totalLectures} />
                                        <div className="space-y-0.5">
                                            <p className="vd-metric-label">Overall Progress</p>
                                            <p className="vd-metric-value">{completedLectures.length + (isCompleted ? 0 : 1)} <span>/ {totalLectures}</span></p>
                                            <p className="vd-metric-label">lectures done</p>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="w-full space-y-2.5">
                                        {!isCompleted && (
                                            <button
                                                disabled={loading}
                                                onClick={handleLectureCompletion}
                                                className="vd-btn-complete group"
                                            >
                                                <span className="vd-btn-shimmer" />
                                                <FiCheckCircle className="text-sm relative z-10" />
                                                <span className="relative z-10">
                                                    {loading ? 'Saving…' : 'Mark as Completed'}
                                                </span>
                                            </button>
                                        )}
                                        <button onClick={handleRewatch} className="vd-btn-rewatch">
                                            <FiRotateCcw className="text-sm" />
                                            Rewatch Lecture
                                        </button>
                                    </div>

                                    {/* Micro nav */}
                                    <div className="flex w-full gap-2.5">
                                        {!ifFirstVideo() && (
                                            <button onClick={goToPrevVideo} className="vd-end-nav-btn flex-1">
                                                <FiChevronLeft className="text-sm" /> Previous
                                            </button>
                                        )}
                                        {!ifLastVideo() && (
                                            <button onClick={goToNextVideo} className="vd-end-nav-btn-amber flex-1">
                                                Next <FiChevronRight className="text-sm" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                    {/* Title + Progress */}
                    <div className="lg:col-span-2 space-y-4">
                        <h1 className="vd-title">{videoData.title}</h1>

                        {/* Inline progress bar */}
                        <div className="vd-progress-strip">
                            <div className="flex items-center justify-between mb-2">
                                <span className="vd-metric-label">Course Progress</span>
                                <span className="vd-progress-count">{completedLectures.length} / {totalLectures} lectures</span>
                            </div>
                            <div className="vd-bar-track">
                                <div
                                    className="vd-bar-fill"
                                    style={{ width: `${(completedLectures.length / totalLectures) * 100}%` }}
                                />
                                {/* Travelling glow dot */}
                                <div
                                    className="vd-bar-dot"
                                    style={{ left: `calc(${(completedLectures.length / totalLectures) * 100}% - 6px)` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation triggers */}
                    {!videoEnded && (
                        <div className="flex gap-2.5 lg:justify-end items-center lg:pt-2">
                            {!ifFirstVideo() && (
                                <NavBtn
                                    onClick={goToPrevVideo}
                                    icon={<FiChevronLeft />}
                                    label="Prev"
                                    variant="secondary"
                                />
                            )}
                            {!ifLastVideo() && (
                                <NavBtn
                                    onClick={goToNextVideo}
                                    icon={<FiChevronRight />}
                                    label="Next"
                                    variant="primary"
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* ══ DESCRIPTION CARD ═══════════════════════════════════════ */}
                {videoData.description && (
                    <div className="vd-desc-card">
                        <div className="vd-desc-accent" />
                        <div className="vd-desc-inner">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="vd-icon-chip">
                                    <FiFileText className="text-amber-400 text-sm" />
                                </div>
                                <h3 className="vd-desc-heading">Lecture Notes</h3>
                            </div>
                            <p className="vd-desc-body">{videoData.description}</p>
                        </div>
                    </div>
                )}

                {/* Bottom spacer */}
                <div className="h-8" />
            </div>

            <style>{sharedStyles}</style>
        </div>
    );
};

const sharedStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

    /* ── Shell & background ─────────────────── */
    .vd-shell {
        background: #050709;
        font-family: 'Instrument Sans', sans-serif;
        position: relative;
        scrollbar-width: thin;
        scrollbar-color: #1e2530 transparent;
    }
    .vd-shell::-webkit-scrollbar { width: 5px; }
    .vd-shell::-webkit-scrollbar-track { background: transparent; }
    .vd-shell::-webkit-scrollbar-thumb { background: #1e2530; border-radius: 99px; }

    .vd-ambient {
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 100vh;
        pointer-events: none;
        z-index: 0;
        background:
            radial-gradient(ellipse 60% 40% at 50% -10%, rgba(245,158,11,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 85% 20%, rgba(245,158,11,0.04) 0%, transparent 60%);
    }

    .vd-content { position: relative; z-index: 1; }

    /* ── Page enter animation ───────────────── */
    .vd-page-enter { opacity: 0; transform: translateY(12px); transition: opacity .5s ease, transform .5s ease; }
    .vd-page-enter-active { opacity: 1; transform: translateY(0); }

    /* ── Video stage ────────────────────────── */
    .vd-stage-wrap { position: relative; }

    .vd-glow-halo {
        position: absolute;
        inset: -20px;
        border-radius: 2rem;
        background: radial-gradient(ellipse at center, rgba(245,158,11,0.06) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
    }

    .vd-stage {
        position: relative;
        z-index: 1;
        border-radius: 1.25rem;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.06);
        box-shadow:
            0 0 0 1px rgba(245,158,11,0.05),
            0 30px 60px -15px rgba(0,0,0,0.7),
            0 0 80px -20px rgba(245,158,11,0.08);
        background: #000;
    }

    /* ── End-screen overlay ─────────────────── */
    .vd-endscreen {
        position: absolute;
        inset: 0;
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(5,7,9,0.88);
        backdrop-filter: blur(18px) saturate(120%);
        animation: fadeIn 0.35s cubic-bezier(.4,0,.2,1) forwards;
    }

    .vd-grid-overlay {
        position: absolute;
        inset: 0;
        background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
        background-size: 40px 40px;
        pointer-events: none;
    }

    .vd-endscreen-card {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
        width: 100%;
        max-width: 340px;
        padding: 2rem 1.75rem;
        background: rgba(15,18,24,0.9);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 1.5rem;
        box-shadow: 0 40px 80px -20px rgba(0,0,0,0.8), 0 0 40px -10px rgba(245,158,11,0.08);
    }

    .vd-sparkle-ring {
        width: 56px; height: 56px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        background: radial-gradient(circle, rgba(245,158,11,0.15), rgba(245,158,11,0.04));
        border: 1px solid rgba(245,158,11,0.25);
        box-shadow: 0 0 20px rgba(245,158,11,0.15);
        animation: pulse-ring 2s ease infinite;
    }

    @keyframes pulse-ring {
        0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.15); }
        50%       { box-shadow: 0 0 32px rgba(245,158,11,0.28); }
    }

    .vd-end-title {
        font-family: 'Syne', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        color: #f5f5f5;
        text-align: center;
        letter-spacing: -0.02em;
    }

    .vd-end-sub {
        font-size: 0.7rem;
        color: #6b7280;
        text-align: center;
        letter-spacing: 0.04em;
    }

    .vd-end-progress-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
        padding: 0.875rem 1rem;
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 0.875rem;
    }

    /* ── CTA buttons ────────────────────────── */
    .vd-btn-complete {
        position: relative;
        overflow: hidden;
        width: 100%;
        display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        padding: 0.8rem 1rem;
        font-size: 0.8rem; font-weight: 700;
        font-family: 'Instrument Sans', sans-serif;
        letter-spacing: 0.02em;
        border-radius: 0.875rem;
        background: linear-gradient(135deg, #f59e0b, #fbbf24);
        color: #0a0c10;
        box-shadow: 0 8px 24px -6px rgba(245,158,11,0.35);
        transition: all 0.2s ease;
        cursor: pointer;
    }
    .vd-btn-complete:hover { transform: translateY(-1px); box-shadow: 0 12px 30px -6px rgba(245,158,11,0.45); }
    .vd-btn-complete:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .vd-btn-shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
        transform: translateX(-100%);
        transition: transform 0.6s ease;
    }
    .vd-btn-complete:hover .vd-btn-shimmer { transform: translateX(100%); }

    .vd-btn-rewatch {
        width: 100%;
        display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        padding: 0.75rem 1rem;
        font-size: 0.8rem; font-weight: 600;
        font-family: 'Instrument Sans', sans-serif;
        letter-spacing: 0.02em;
        border-radius: 0.875rem;
        background: rgba(255,255,255,0.04);
        color: #9ca3af;
        border: 1px solid rgba(255,255,255,0.08);
        transition: all 0.2s ease;
        cursor: pointer;
    }
    .vd-btn-rewatch:hover { background: rgba(255,255,255,0.07); color: #e5e7eb; border-color: rgba(255,255,255,0.14); }

    .vd-end-nav-btn {
        display: flex; align-items: center; justify-content: center; gap: 0.25rem;
        padding: 0.6rem 0.75rem;
        font-size: 0.7rem; font-weight: 600;
        border-radius: 0.625rem;
        background: rgba(255,255,255,0.04);
        color: #6b7280;
        border: 1px solid rgba(255,255,255,0.07);
        cursor: pointer;
        transition: all 0.2s;
    }
    .vd-end-nav-btn:hover { background: rgba(255,255,255,0.08); color: #d1d5db; }

    .vd-end-nav-btn-amber {
        display: flex; align-items: center; justify-content: center; gap: 0.25rem;
        padding: 0.6rem 0.75rem;
        font-size: 0.7rem; font-weight: 600;
        border-radius: 0.625rem;
        background: rgba(245,158,11,0.08);
        color: #fbbf24;
        border: 1px solid rgba(245,158,11,0.2);
        cursor: pointer;
        transition: all 0.2s;
    }
    .vd-end-nav-btn-amber:hover { background: rgba(245,158,11,0.14); border-color: rgba(245,158,11,0.35); }

    /* ── Title ──────────────────────────────── */
    .vd-title {
        font-family: 'Syne', sans-serif;
        font-size: clamp(1.25rem, 2.5vw, 1.75rem);
        font-weight: 800;
        color: #f9fafb;
        letter-spacing: -0.03em;
        line-height: 1.2;
    }

    /* ── Progress strip ─────────────────────── */
    .vd-progress-strip {
        padding: 0.875rem 1rem;
        background: rgba(255,255,255,0.025);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 0.875rem;
    }

    .vd-bar-track {
        position: relative;
        height: 4px;
        background: rgba(255,255,255,0.06);
        border-radius: 99px;
        overflow: visible;
    }

    .vd-bar-fill {
        height: 100%;
        border-radius: 99px;
        background: linear-gradient(90deg, #d97706, #f59e0b, #fbbf24);
        box-shadow: 0 0 8px rgba(245,158,11,0.4);
        transition: width 0.7s cubic-bezier(.4,0,.2,1);
    }

    .vd-bar-dot {
        position: absolute;
        top: 50%;
        width: 12px; height: 12px;
        transform: translateY(-50%);
        background: #fbbf24;
        border: 2px solid #050709;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(245,158,11,0.6);
        transition: left 0.7s cubic-bezier(.4,0,.2,1);
    }

    .vd-progress-count {
        font-family: 'DM Mono', monospace;
        font-size: 0.7rem;
        color: #fbbf24;
        font-weight: 500;
    }

    /* ── Description card ───────────────────── */
    .vd-desc-card {
        position: relative;
        border-radius: 1.25rem;
        border: 1px solid rgba(255,255,255,0.06);
        background: rgba(255,255,255,0.02);
        overflow: hidden;
        transition: border-color 0.2s;
    }
    .vd-desc-card:hover { border-color: rgba(255,255,255,0.1); }

    .vd-desc-accent {
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 3px;
        background: linear-gradient(to bottom, #f59e0b, rgba(245,158,11,0.2));
        border-radius: 99px;
    }

    .vd-desc-inner { padding: 1.5rem 1.5rem 1.5rem 2rem; }

    .vd-icon-chip {
        width: 32px; height: 32px;
        border-radius: 0.5rem;
        display: flex; align-items: center; justify-content: center;
        background: rgba(245,158,11,0.1);
        border: 1px solid rgba(245,158,11,0.2);
        flex-shrink: 0;
    }

    .vd-desc-heading {
        font-family: 'Syne', sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        color: #e5e7eb;
        letter-spacing: 0.01em;
    }

    .vd-desc-body {
        font-size: 0.85rem;
        line-height: 1.75;
        color: #6b7280;
        white-space: pre-wrap;
    }

    /* ── Shared metric typography ───────────── */
    .vd-metric-label {
        font-size: 0.65rem;
        color: #4b5563;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        font-weight: 600;
    }

    .vd-metric-value {
        font-family: 'DM Mono', monospace;
        font-size: 1.25rem;
        font-weight: 600;
        color: #f5f5f5;
        line-height: 1;
    }
    .vd-metric-value span { font-size: 0.75rem; color: #4b5563; }

    /* ── Loading states ─────────────────────── */
    .vd-spinner {
        width: 36px; height: 36px;
        border-radius: 50%;
        border: 2px solid rgba(245,158,11,0.15);
        border-top-color: #f59e0b;
        animation: spin 0.8s linear infinite;
        margin: 0 auto;
    }

    .vd-loading-text {
        font-family: 'Instrument Sans', sans-serif;
        font-size: 0.8rem;
        color: #4b5563;
        letter-spacing: 0.06em;
    }

    .vd-pulse { animation: pulse 1.8s ease infinite; }

    /* ── video-react skin overrides ─────────── */
    .video-react .video-react-big-play-button {
        background: rgba(245,158,11,0.92) !important;
        border: none !important;
        border-radius: 9999px !important;
        width: 3.75em !important;
        height: 3.75em !important;
        line-height: 3.75em !important;
        margin-left: -1.875em !important;
        margin-top: -1.875em !important;
        box-shadow: 0 0 40px rgba(245,158,11,0.35) !important;
        transition: transform .15s ease, box-shadow .15s ease !important;
    }
    .video-react .video-react-big-play-button:hover {
        transform: scale(1.08) !important;
        box-shadow: 0 0 55px rgba(245,158,11,0.5) !important;
    }
    .video-react .video-react-big-play-button:before {
        font-size: 48px !important;
        color: #050709 !important;
    }
    .video-react .video-react-control-bar {
        background: linear-gradient(to top, rgba(5,7,9,0.9), transparent) !important;
        padding-bottom: 0.5rem !important;
    }
    .video-react .video-react-play-progress { background: #f59e0b !important; }
    .video-react .video-react-slider:focus { box-shadow: 0 0 0 3px rgba(245,158,11,0.35) !important; }

    /* ── Keyframes ──────────────────────────── */
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
    }
`;

export default VideoDetails;