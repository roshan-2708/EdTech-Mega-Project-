import React, { useEffect, useState } from "react";
import { buyCourse } from "../../services/operations/studentFeatureApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getFullCourseDetails } from "../../services/operations/courseAPI";
import GetAvgRating from "../../utils/avgRating";
import ErrorPage from "../ErrorPage";
import RatingStars from "../../components/common/RatingStars";
import { formDate } from "../../services/formatDate";
import CourseDetailsCard from "./CourseDetailsCard";

const CourseDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams();

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);

    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState(null);
    const [averageReview, setAverageReview] = useState(0);
    const [totalNumberOfLec, setTotalNumberOfLec] = useState(0);

    // Fetch course details
    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            try {
                const result = await getFullCourseDetails(courseId, token);
                setCourseData(result); // ✅ result IS the course
            } catch (error) {
                console.error("Could not fetch course details", error);
                setCourseData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId, token]);

    // Average rating
    useEffect(() => {
        if (!courseData?.ratingAndReview) return;
        const avg = GetAvgRating(courseData.ratingAndReview);
        setAverageReview(avg);
    }, [courseData]);

    // Total lectures
    useEffect(() => {
        let lectures = 0;
        courseData?.courseContent?.forEach((sec) => {
            lectures += sec.subSection?.length || 0;
        });
        setTotalNumberOfLec(lectures);
    }, [courseData]);

    const [isActive, setIsActive] = useState(Array(0));
    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id) ? isActive.concat(id) : isActive.filter((e) => e != id)
        );
    }

    const handleBuyCourse = () => {
        if (!token) {
            toast.error("Please login to buy this course");
            navigate("/login");
            return;
        }

        buyCourse(token, [courseId], user, navigate, dispatch);
    };

    if (loading) {
        return <div>Loading...</div>;
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
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8 lg:flex-row">

            {/* LEFT SECTION */}
            <div className="flex flex-1 flex-col gap-6">
                <div className="rounded-xl bg-richblack-800 p-6 text-white">
                    <h1 className="text-3xl font-bold">{courseName}</h1>
                    <p className="mt-2 text-richblack-200">{courseDescription}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-yellow-100">
                            {averageReview.toFixed(1)}
                        </span>
                        <RatingStars Review_Count={averageReview} Star_Size={20} />
                        <span className="text-sm text-richblack-300">
                            ({ratingAndReview?.length || 0} reviews)
                        </span>
                        <span className="text-sm text-richblack-300">
                            • {studentEnrolled?.length || 0} students
                        </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-richblack-300">
                        <p>Created by <span className="text-white font-medium">{instructor.firstName}</span></p>
                        <p>Created at {formDate(createdAt)}</p>
                        <p>Language: English</p>
                    </div>
                </div>

                {/* WHAT YOU WILL LEARN */}
                <div className="rounded-xl bg-richblack-800 p-6 text-white">
                    <h2 className="mb-4 text-xl font-semibold">What you will learn</h2>
                    <p className="text-richblack-200">{whatYouWillLearn}</p>
                </div>

                {/* COURSE CONTENT */}
                <div className="rounded-xl bg-richblack-800 p-6 text-white">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Course Content</h2>
                        <button
                            onClick={() => setIsActive([])}
                            className="text-sm text-yellow-100 hover:underline"
                        >
                            Collapse all sections
                        </button>
                    </div>

                    <div className="mb-4 flex gap-4 text-sm text-richblack-300">
                        <span>{courseContent.length} sections</span>
                        <span>{totalNumberOfLec} lectures</span>
                        <span>{courseDuration} hours</span>
                    </div>

                    section
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full lg:w-[400px]">
                <CourseDetailsCard
                    course={courseData}
                    handleBuyCourse={handleBuyCourse}
                />
            </div>

        </div>
    );

};

export default CourseDetails;
