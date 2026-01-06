import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import IconButton from '../../components/common/IconButton';
import { resetCourseState, setStep } from '../../slice/courseSlice';
import { COURSE_STATUS } from '../../utils/constants';
import { editCourseDetails } from '../../services/operations/courseAPI';

const Publish = () => {
    const { register, handleSubmit, setValue, getValues } = useForm();
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (course?.status === COURSE_STATUS.PUBLISHED) {
            setValue("public", true);
        }
    }, [course, setValue]);

    const goToCourse = () => {
        dispatch(resetCourseState());
        navigate("/dashboard/my-courses");
    };

    const handleCoursePublish = async () => {
        try {
            if (!course?._id) {
                console.error("❌ Course ID missing");
                return;
            }

            const isPublic = getValues("public");
            const currentStatus = course.status || COURSE_STATUS.DRAFT;

            // If status has not changed, just go back
            if (
                (currentStatus === COURSE_STATUS.PUBLISHED && isPublic) ||
                (currentStatus === COURSE_STATUS.DRAFT && !isPublic)
            ) {
                goToCourse();
                return;
            }

            // ✅ Send a plain object to editCourseDetails
            const courseData = {
                courseId: course._id,
                status: isPublic ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT,
            };

            setLoading(true);
            const res = await editCourseDetails(courseData, token);

            if (res) goToCourse();
            setLoading(false);
        } catch (error) {
            console.error("❌ Publish error:", error);
            setLoading(false);
        }
    };

    const onSubmit = (data) => {
        handleCoursePublish();
    };

    const goBack = () => {
        dispatch(setStep(2));
    };

    return (
        <div className='rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700'>
            <p>Publish Course</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input
                        type="checkbox"
                        id="public"
                        {...register("public")}
                        className="rounded-sm h-4 w-4"
                    />
                    <label htmlFor="public">Set course as Publish</label>
                </div>

                <div className="flex justify-end gap-x-3 mt-4">
                    <button
                        disabled={loading}
                        type="button"
                        onClick={goBack}
                        className="flex items-center rounded-md"
                    >
                        Back
                    </button>

                    <IconButton
                        type="submit"
                        disabled={loading}
                        text="Save Changes"
                    />
                </div>
            </form>
        </div>
    );
};

export default Publish;
