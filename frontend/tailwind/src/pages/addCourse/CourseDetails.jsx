import React, { useEffect, useState, useMemo } from "react";
import { buyCourse } from "../../services/operations/studentFeatureApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchCourseDetails } from "../../services/operations/courseAPI";
import GetAvgRating from "../../utils/avgRating";
import ErrorPage from "../ErrorPage";
import RatingStars from "../../components/common/RatingStars";
import { formDate } from "../../services/formatDate";
import CourseDetailsCard from "./CourseDetailsCard";
import { ChevronDown, ChevronUp, Globe, Calendar, User, BookOpen, Clock, Video } from "lucide-react";

const CourseDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams();

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState(null);
    const [isActive, setIsActive] = useState([]); // Track open sections

    useEffect(() => {
        const loadCourseDetails = async () => {
            setLoading(true);
            try {
                const response = await fetchCourseDetails(courseId);
                if (response?.data?.course) {
                    setCourseData(response.data.course);
                } else {
                    setCourseData(null);
                }
            } catch (error) {
                console.error("Could not fetch course details", error);
                setCourseData(null);
            } finally {
                setLoading(false);
            }
        };
        loadCourseDetails();
    }, [courseId]);

    // Optimized Calculations via useMemo
    const averageReview = useMemo(() => {
        if (!courseData?.ratingAndReview) return 0;
        return GetAvgRating(courseData.ratingAndReview);
    }, [courseData]);

    const totalNumberOfLec = useMemo(() => {
        let lectures = 0;
        courseData?.courseContent?.forEach((sec) => {
            lectures += sec.subSection?.length || 0;
        });
        return lectures;
    }, [courseData]);

    const handleActive = (id) => {
        setIsActive(
            isActive.includes(id) 
                ? isActive.filter((e) => e !== id) 
                : [...isActive, id]
        );
    };

    const handleBuyCourse = () => {
        if (!token) {
            toast.error("Please login to buy this course");
            navigate("/login");
            return;
        }
        buyCourse(token, [courseId], user, navigate, dispatch);
    };

    // Modern Shimmer/Skeleton Screen for Loading State
    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12 animate-pulse flex flex-col lg:flex-row gap-8">
                <div className="flex-1 flex flex-col gap-6">
                    <div className="h-60 bg-richblack-800 rounded-2xl w-full" />
                    <div className="h-40 bg-richblack-800 rounded-2xl w-full" />
                    <div className="h-80 bg-richblack-800 rounded-2xl w-full" />
                </div>
                <div className="w-full lg:w-[400px] h-96 bg-richblack-800 rounded-2xl" />
            </div>
        );
    }

    if (!courseData) {
        return <ErrorPage />;
    }

    const {
        courseName,
        courseDescription,
        ratingAndReview,
        studentEnrolled,
        instructor,
        createdAt,
        whatYouWillLearn,
        courseContent,
        courseDuration
    } = courseData;

    return (
        <div className="relative mx-auto flex max-w-7xl flex-col-reverse gap-10 px-6 py-10 lg:flex-row items-start">
            
            {/* LEFT SECTION (Main Details) */}
            <div className="flex flex-1 flex-col gap-8 w-full">
                
                {/* Hero Header Card */}
                <div className="rounded-2xl bg-richblack-800 p-6 md:p-8 border border-richblack-700 text-white shadow-xl">
                    <h1 className="text-2xl md:text-4xl font-extrabold text-richblack-5 tracking-tight">
                        {courseName}
                    </h1>
                    <p className="mt-3 text-base text-richblack-200 leading-relaxed max-w-[90%]">
                        {courseDescription}
                    </p>

                    {/* Ratings & Enrolled Stats */}
                    <div className="mt-5 flex flex-wrap items-center gap-3 bg-richblack-900/40 p-3 rounded-xl border border-richblack-700/50 w-fit">
                        <span className="font-bold text-xl text-yellow-100">
                            {Number(averageReview).toFixed(1)}
                        </span>
                        <RatingStars Review_Count={averageReview} Star_Size={18} />
                        <span className="text-xs text-richblack-300">
                            ({ratingAndReview?.length || 0} reviews)
                        </span>
                        <div className="h-4 w-[1px] bg-richblack-600 hidden sm:block" />
                        <span className="text-xs font-medium text-caribbeangreen-200 bg-caribbeangreen-200/10 px-2 py-0.5 rounded">
                            {studentEnrolled?.length || 0} Students Enrolled
                        </span>
                    </div>

                    {/* Meta Data Grid */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-richblack-300 border-t border-richblack-700/60 pt-5">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-yellow-100" />
                            <p>Instructor: <span className="text-white font-medium">{instructor?.firstName} {instructor?.lastName}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-yellow-100" />
                            <p>Updated: <span className="text-richblack-5 font-medium">{formDate(createdAt)}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-yellow-100" />
                            <p>Language: <span className="text-richblack-5 font-medium">English</span></p>
                        </div>
                    </div>
                </div>

                {/* WHAT YOU WILL LEARN */}
                <div className="rounded-2xl bg-richblack-800 p-6 border border-richblack-700 text-white shadow-md">
                    <h2 className="mb-4 text-xl font-bold border-b border-richblack-700 pb-2">What you will learn</h2>
                    <p className="text-sm text-richblack-200 leading-relaxed whitespace-pre-line">
                        {whatYouWillLearn}
                    </p>
                </div>

                {/* COURSE CONTENT ACCORDION */}
                <div className="rounded-2xl bg-richblack-800 p-6 border border-richblack-700 text-white shadow-md">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold">Course Curriculum</h2>
                            <div className="mt-1 flex items-center gap-3 text-xs text-richblack-300">
                                <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{courseContent?.length || 0} sections</span>
                                <span className="flex items-center gap-1"><Video className="h-3.5 w-3.5" />{totalNumberOfLec} lectures</span>
                                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{courseDuration || "N/A"} total hours</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsActive([])}
                            className="text-xs font-semibold text-yellow-100 bg-yellow-100/10 px-3 py-1.5 rounded-lg hover:bg-yellow-100/20 transition-all"
                        >
                            Collapse all sections
                        </button>
                    </div>

                    {/* Accordion Layout */}
                    <div className="flex flex-col gap-3">
                        {courseContent?.map((section) => {
                            const isOpen = isActive.includes(section._id);
                            return (
                                <div key={section._id} className="overflow-hidden rounded-xl border border-richblack-700 bg-richblack-900/20">
                                    {/* Section Header */}
                                    <button
                                        onClick={() => handleActive(section._id)}
                                        className="flex w-full items-center justify-between bg-richblack-700/30 p-4 font-medium transition-colors hover:bg-richblack-700/50"
                                    >
                                        <div className="flex items-center gap-3 text-left text-sm md:text-base">
                                            {isOpen ? <ChevronUp className="h-4 w-4 text-yellow-100" /> : <ChevronDown className="h-4 w-4 text-richblack-400" />}
                                            <span>{section.sectionName}</span>
                                        </div>
                                        <span className="text-xs text-yellow-100 font-medium whitespace-nowrap ml-2">
                                            {section.subSection?.length || 0} lectures
                                        </span>
                                    </button>

                                    {/* Subsections Content */}
                                    {isOpen && (
                                        <div className="bg-richblack-900/60 p-2 divide-y divide-richblack-800/60">
                                            {section.subSection?.map((sub) => (
                                                <div key={sub._id} className="flex items-center gap-3 px-4 py-3 text-xs md:text-sm text-richblack-200">
                                                    <Video className="h-4 w-4 text-richblack-400 shrink-0" />
                                                    <p className="flex-1 font-medium">{sub.title}</p>
                                                    <span className="text-xs text-richblack-400">{sub.duration || "00:00"}</span>
                                                </div>
                                            ))}
                                            {section.subSection?.length === 0 && (
                                                <div className="p-4 text-xs text-center italic text-richblack-500">
                                                    No lectures available in this section.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION (Sticky Sidebar) */}
            <div className="w-full lg:w-[400px] lg:sticky lg:top-6 self-start">
                <CourseDetailsCard
                    course={courseData}
                    handleBuyCourse={handleBuyCourse}
                />
            </div>

        </div>
    );
};

export default CourseDetails;