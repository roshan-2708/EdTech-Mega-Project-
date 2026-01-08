import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatingStar from "../common/RatingStars";
import GetAvgRating from "../../utils/avgRating";

const Course_Card = ({ course, Height }) => {
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    const reviews = course?.ratingAndReview || course?.reviews || [];

    useEffect(() => {
        const count = GetAvgRating(reviews);
        setAvgReviewCount(count);
    }, [course]);

    return (
        <Link to={`/course/${course?._id}`}>
            <div>
                <img
                    src={course?.thumbnail || course?.thumbnailUrl}
                    className={`${Height} w-full rounded-xl object-cover`}
                    alt=""
                />

                <p>{course?.courseName || course?.title}</p>

                <p>
                    {course?.instructor?.firstName
                        ? `${course.instructor.firstName} ${course.instructor.lastName}`
                        : "Instructor"}
                </p>

                <div>
                    <span>{avgReviewCount}</span>
                    <RatingStar Review_Count={avgReviewCount} />
                    <span>{reviews.length} Ratings</span>
                </div>

                <p>₹ {course?.price}</p>
            </div>
        </Link>
    );
};

export default Course_Card;
