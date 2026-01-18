import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStar from "react-star-ratings";
import { createRating } from "../services/operations/courseAPI";

const CourseReviewModal = ({ setReviewModal }) => {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const { courseEntireData } = useSelector((state) => state.viewCourse);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        defaultValues: {
            courseRating: 0,
            courseExperience: "",
        },
    });

    const currentRating = watch("courseRating");

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
            reset(); // reset form after submission
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

                    {/* Star Rating */}
                    <Controller
                        name="courseRating"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <ReactStar
                                count={5}
                                size={24}
                                rating={field.value}
                                changeRating={(newRating) => field.onChange(newRating)}
                                activeColor="#ffd700"
                            />
                        )}
                    />
                    {errors.courseRating && (
                        <p className="text-red-400 text-sm">Rating is required</p>
                    )}

                    {/* Review Textarea */}
                    <Controller
                        name="courseExperience"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                className="w-full p-2 rounded bg-richblack-700 resize-none"
                                placeholder="Share your experience..."
                            />
                        )}
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
                            className={`w-full py-2 rounded text-black ${currentRating === 0
                                    ? "bg-yellow-200 cursor-not-allowed"
                                    : "bg-yellow-400 hover:bg-yellow-500"
                                } transition`}
                            disabled={currentRating === 0}
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
