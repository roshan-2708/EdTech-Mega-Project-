import React, { useEffect, useState, useMemo } from "react";
import { buyCourse } from "../../../services/operations/studentFeatureApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchCourseDetails } from "../../courses/courseAPI";
import GetAvgRating from "../../../utils/avgRating";
import ErrorPage from "../../../pages/ErrorPage";
import RatingStars from "../../../components/common/RatingStars";
import { formDate } from "../../../services/formatDate";
import CourseDetailsCard from "./CourseDetailsCard";
import Footer from "../../../components/layout/Footer";
import { ChevronDown, ChevronUp, Globe, Calendar, BookOpen, Clock, Video, PlayCircle, ShieldCheck, Award } from "lucide-react";

const CourseDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams();

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState(null);
    const [isActive, setIsActive] = useState([]);

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

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-6 py-12 animate-pulse flex flex-col lg:flex-row gap-8 bg-richblack-900 min-h-screen">
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
        thumbnail,
        ratingAndReview,
        studentEnrolled,
        instructor,
        createdAt,
        whatYouWillLearn,
        courseContent,
        courseDuration
    } = courseData;

    return (
        <div className="relative bg-richblack-900 text-richblack-5 min-h-screen font-inter flex flex-col justify-between">
            
            {/* Top Hero Header Section with Rich Dark Gradient */}
            <div className="relative bg-gradient-to-b from-richblack-800 via-richblack-800/90 to-richblack-900 border-b border-richblack-700/60 py-12">
                <div className="mx-auto max-w-maxContent px-4 lg:px-8">
                    <p className="text-xs text-richblack-300 mb-3 flex items-center gap-2">
                        <span className="hover:text-yellow-50 cursor-pointer">Home</span> / 
                        <span className="hover:text-yellow-50 cursor-pointer">Catalog</span> / 
                        <span className="text-yellow-50 font-medium">{courseData?.category?.name || "Web Development"}</span>
                    </p>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-richblack-5 tracking-tight">
                        {courseName}
                    </h1>
                    <p className="mt-3 text-sm lg:text-base text-richblack-200 max-w-3xl leading-relaxed">
                        {courseDescription}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs lg:text-sm text-richblack-200">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-yellow-400 text-base">{Number(averageReview).toFixed(1)}</span>
                            <RatingStars Review_Count={averageReview} Star_Size={16} />
                            <span className="text-richblack-400">({ratingAndReview?.length || 0} reviews)</span>
                        </div>
                        <span className="text-richblack-400">•</span>
                        <span className="text-richblack-200 font-medium">{studentEnrolled?.length || 0} students enrolled</span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-richblack-300">
                        <p className="flex items-center gap-1.5">
                            Created by <span className="text-yellow-50 font-medium underline underline-offset-2">{instructor?.firstName} {instructor?.lastName}</span>
                        </p>
                        <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-richblack-400" /> Last updated {formDate(createdAt)}</p>
                        <p className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-richblack-400" /> English</p>
                    </div>
                </div>
            </div>

            {/* Main Layout Container */}
            <div className="mx-auto max-w-maxContent px-4 lg:px-8 w-full py-12 flex flex-col lg:flex-row gap-10 items-start relative">
                
                {/* Left Content Area */}
                <div className="w-full lg:w-[calc(100%-420px)] flex flex-col gap-8">
                    
                    {/* Video / Thumbnail Banner Preview */}
                    <div className="relative rounded-md overflow-hidden bg-richblack-800 border border-richblack-700/80 shadow-2xl group">
                        <img src={thumbnail} alt="course thumbnail" className="w-full h-[320px] md:h-[400px] object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/90 via-richblack-900/20 to-transparent flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-yellow-50/90 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-2xl shadow-yellow-50/20">
                                <PlayCircle className="w-8 h-8 text-richblack-900 fill-yellow-50" />
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-richblack-900/80 backdrop-blur-md text-xs px-3 py-1.5 rounded-md font-semibold text-richblack-5 border border-richblack-700">
                            Course Preview
                        </div>
                    </div>

                    {/* What You Will Learn */}
                    <div className="rounded-md border border-richblack-700/80 bg-richblack-800/60 backdrop-blur-md p-6 lg:p-8 shadow-xl">
                        <h2 className="text-xl font-bold text-richblack-5 mb-4 flex items-center gap-2">
                            <span className="w-2 h-6 bg-yellow-50 rounded-full"></span>
                            What you will learn
                        </h2>
                        <p className="text-sm text-richblack-200 leading-relaxed whitespace-pre-line">
                            {whatYouWillLearn}
                        </p>
                    </div>

                    {/* Course Curriculum */}
                    <div className="rounded-md border border-richblack-700/80 bg-richblack-800/60 backdrop-blur-md p-6 lg:p-8 shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-richblack-5 flex items-center gap-2">
                                    <span className="w-2 h-6 bg-yellow-50 rounded-md"></span>
                                    Course Curriculum
                                </h2>
                                <div className="mt-2 flex items-center gap-4 text-xs text-richblack-300 font-medium">
                                    <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-yellow-50" />{courseContent?.length || 0} sections</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5 text-yellow-50" />{totalNumberOfLec} lectures</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-yellow-50" />{courseDuration || "Total length"}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsActive([])}
                                className="text-xs font-semibold text-yellow-50 hover:underline bg-richblack-700/40 px-3 py-1.5 rounded-lg border border-richblack-600 transition-colors"
                            >
                                Collapse all sections
                            </button>
                        </div>

                        {/* Accordion List */}
                        <div className="flex flex-col gap-3">
                            {courseContent?.map((section) => {
                                const isOpen = isActive.includes(section._id);
                                return (
                                    <div key={section._id} className="overflow-hidden rounded-xl border border-richblack-700/70 bg-richblack-900/50 transition-all">
                                        <button
                                            onClick={() => handleActive(section._id)}
                                            className="flex w-full items-center justify-between bg-richblack-700/30 p-4 font-medium transition-colors hover:bg-richblack-700/50"
                                        >
                                            <div className="flex items-center gap-3 text-left text-sm md:text-base font-semibold text-richblack-5">
                                                {isOpen ? <ChevronUp className="h-4 w-4 text-yellow-50" /> : <ChevronDown className="h-4 w-4 text-richblack-400" />}
                                                <span>{section.sectionName}</span>
                                            </div>
                                            <span className="text-xs font-medium text-richblack-300 bg-richblack-800 px-2.5 py-1 rounded-md">
                                                {section.subSection?.length || 0} lectures
                                            </span>
                                        </button>

                                        {isOpen && (
                                            <div className="bg-richblack-900/80 p-2 divide-y divide-richblack-800/80">
                                                {section.subSection?.map((sub) => (
                                                    <div key={sub._id} className="flex items-center gap-3 px-4 py-3 text-xs md:text-sm text-richblack-200 hover:bg-richblack-800/40 rounded-lg transition-colors">
                                                        <Video className="h-4 w-4 text-yellow-50/70 shrink-0" />
                                                        <p className="flex-1 font-medium">{sub.title}</p>
                                                        <span className="text-xs text-richblack-400">{sub.duration || "12:45"}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Instructor Profile */}
                    <div className="rounded-md border border-richblack-700/80 bg-richblack-800/60 backdrop-blur-md p-6 lg:p-8 shadow-xl">
                        <h2 className="text-xl font-bold text-richblack-5 mb-5 flex items-center gap-2">
                            <span className="w-2 h-6 bg-yellow-50 rounded-full"></span>
                            Instructor
                        </h2>
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={instructor?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${instructor?.firstName || 'Instructor'}`}
                                alt="instructor"
                                className="w-16 h-16 rounded-full object-cover border-2 border-yellow-50/20 shadow-lg"
                            />
                            <div>
                                <p className="text-base lg:text-lg font-bold text-richblack-5">{instructor?.firstName} {instructor?.lastName}</p>
                                <p className="text-xs text-yellow-50 font-medium">Senior Software Architect & Educator</p>
                            </div>
                        </div>
                        <p className="text-xs lg:text-sm text-richblack-200 leading-relaxed">
                            {instructor?.additionalDetails?.about || "Dedicated instructor with extensive industry experience focused on delivering robust and practical software engineering education."}
                        </p>
                    </div>

                </div>

                {/* Right Sticky Sidebar Card Area */}
                <div className="w-full lg:w-[380px] lg:sticky lg:top-24">
                    <CourseDetailsCard
                        course={courseData}
                        handleBuyCourse={handleBuyCourse}
                    />
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default CourseDetails;