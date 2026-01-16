import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStar from "react-star-ratings";
import { createRating } from "../services/operations/courseAPI";

const CourseReviewModal = ({ setReviewModal }) => {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const { courseEntireData } = useSelector((state) => state.viewCourse);

    const [rating, setRating] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // Register courseRating explicitly for validation
    useEffect(() => {
        register("courseRating", { required: true });
        setValue("courseExperience", "");
        setValue("courseRating", 0);
    }, [register, setValue]);

    const ratingChanged = (newRating) => {
        setRating(newRating);
        setValue("courseRating", newRating, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        if (!courseEntireData?._id) return;

        const payload = {
            courseId: courseEntireData._id,
            rating: data.courseRating,
            review: data.courseExperience,
        };

        console.log("Review Payload:", payload);

        const success = await createRating(payload, token);
        if (success) {
            setReviewModal(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-richblack-800 p-6 rounded-lg w-[500px] text-white">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold">Add Review</p>
                    <button onClick={() => setReviewModal(false)} className="text-xl">✕</button>
                </div>

                {/* User Info */}
                <div className="flex gap-3 mb-4 items-center">
                    <img
                        src={user?.image || "/default-avatar.png"}
                        alt="user"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p>{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-gray-400">Posting publicly</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Rating */}
                    <ReactStar
                        count={5}
                        size={24}
                        rating={rating}
                        changeRating={ratingChanged}
                        activeColor="#ffd700"
                    />
                    {errors.courseRating && (
                        <p className="text-red-400 text-sm">Rating is required</p>
                    )}

                    {/* Review Textarea */}
                    <textarea
                        className="w-full p-2 rounded bg-richblack-700 resize-none"
                        placeholder="Share your experience..."
                        {...register("courseExperience", { required: true })}
                    />
                    {errors.courseExperience && (
                        <p className="text-red-400 text-sm">Review is required</p>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="w-full bg-gray-600 py-2 rounded hover:bg-gray-500 transition"
                            onClick={() => setReviewModal(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={`w-full py-2 rounded text-black ${rating === 0 ? "bg-yellow-200 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"
                                } transition`}
                            disabled={rating === 0}
                        >
                            Submit Review
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CourseReviewModal;
