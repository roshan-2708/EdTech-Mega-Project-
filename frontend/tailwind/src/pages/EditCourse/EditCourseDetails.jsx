import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CourseComponent from '../addCourse/CourseComponent';
import { getFullCourseDetails } from '../../services/operations/courseAPI';
import { setCourse, setEditCourse } from '../../slice/courseSlice';

const EditCourseDetails = () => {
    const dispatch = useDispatch();
    const { courseId } = useParams();
    const { course } = useSelector((state) => state.course);
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const populateCourseDetails = async () => {
            setLoading(true);

            const response = await getFullCourseDetails(courseId, token);

            if (response?.data?.courseDetails) {
                dispatch(setEditCourse(true));
                dispatch(setCourse(response.data.courseDetails));
            }

            setLoading(false);
        };

        populateCourseDetails();
    }, [courseId, token, dispatch]);



    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className='text-white'>Edit Course</h1>
            {course && course._id ? <CourseComponent /> : <p>Course Not Found</p>
            }
        </div>
    );
};


export default EditCourseDetails
