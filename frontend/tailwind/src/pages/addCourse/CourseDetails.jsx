import React from "react";
import { buyCourse } from "../../services/operations/studentFeatureApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const CourseDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { courseId } = useParams();
    const handleBuyCourse = () => {
        if (!token) {
            toast.error("Please login to buy this course");
            navigate("/login");
            return;
        }

        buyCourse(
            token,
            [courseId],
            user,
            navigate,
            dispatch
        );
    };

    return (
        <div className="flex items-center">
            <button
                className="bg-yellow-50 px-4 py-2 rounded"
                onClick={handleBuyCourse}
            >
                Buy Now
            </button>
        </div>
    );
};

export default CourseDetails;
