// services/operations/courseAPI.js
import { apiConnector } from "../apiConnecter"; // ✅ FIXED import
import toast from "react-hot-toast";
// ✅ FIXED: RELATIVE PATHS (apiConnector handles baseURL + /api/v1)
const CREATE_COURSE_API = `/course/createCourse`;
const EDIT_COURSE_API = `/course/editCourse`;
const INSTRUCTOR_COURSES_API = `/course/instructor-courses`;
const COURSE_DETAILS_API = (courseId) => `/course/getFullCourseDetails/${courseId}`;
const COURSE_DELETE_API = (courseId) => `/course/${courseId}`; // ✅ PERFECT!
const CREATE_RATING_API = `/rating/create`
const LECTURE_COMPLETION_API = `/progress/update`

export const createCourse = async (courseData, token) => {
    try {
        console.log("📤 Creating course with:", courseData);

        const formData = new FormData();
        formData.append("courseName", courseData.courseName);
        formData.append("courseDescription", courseData.courseDescription);
        formData.append("price", courseData.coursePrice);
        formData.append("tag", courseData.courseTags);
        formData.append("whatYouWillLearn", courseData.whatYouWillLearn || courseData.courseBenefits);
        formData.append("category", courseData.courseCategory);
        formData.append("status", courseData.status || "Draft");

        if (courseData.thumbnail) {
            formData.append("thumbnailImage", courseData.thumbnail);
        }


        // ✅ FIXED: NO manual Content-Type for FormData
        const result = await apiConnector("POST", CREATE_COURSE_API, formData, {
            Authorization: `Bearer ${token}`,
        });

        console.log("✅ Backend response:", result);
        if (!result?.data?.success) {
            throw new Error("Course creation failed");
        }

        return result.data.data;
    } catch (error) {
        console.error("❌ CreateCourse error:", error.response?.data || error);
        throw error;
    }
};

export const editCourseDetails = async (courseData, token) => {
    try {
        console.log("📤 Editing course with:", courseData);

        const formData = new FormData();

        // Required
        formData.append("courseId", courseData.courseId);

        // Optional fields
        if (courseData.status) formData.append("status", courseData.status);
        if (courseData.courseName) formData.append("courseName", courseData.courseName);
        if (courseData.courseDescription) formData.append("courseDescription", courseData.courseDescription);
        if (courseData.coursePrice !== undefined) formData.append("price", courseData.coursePrice);
        if (courseData.courseTags) formData.append("tag", courseData.courseTags);
        if (courseData.whatYouWillLearn || courseData.courseBenefits) {
            formData.append(
                "whatYouWillLearn",
                courseData.whatYouWillLearn || courseData.courseBenefits
            );
        }
        if (courseData.courseCategory) formData.append("category", courseData.courseCategory);
        if (courseData.thumbnail) formData.append("thumbnailImage", courseData.thumbnail);

        const result = await apiConnector(
            "PUT",
            EDIT_COURSE_API,
            formData,
            {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            }
        );

        console.log("✅ Edit course response:", result);

        if (!result?.data?.success) {
            throw new Error("Course update failed");
        }

        return result.data.data;
    } catch (error) {
        console.error("❌ EditCourse error:", error.response?.data || error);
        throw error;
    }
};

export const getInstructorCourses = async (token) => {
    try {
        const result = await apiConnector("GET", INSTRUCTOR_COURSES_API, null, {
            Authorization: `Bearer ${token}`,
        });
        return result.data.courses || result.data.data || [];
    } catch (error) {
        console.error("❌ GetInstructorCourses error:", error);
        throw error;
    }
};

export const getFullCourseDetails = async (courseId, token) => {
    try {
        const result = await apiConnector("GET", COURSE_DETAILS_API(courseId), null, {
            Authorization: `Bearer ${token}`,
        });
        return result.data.course || result.data.data || null;
    } catch (error) {
        console.error("❌ GetCourseDetails error:", error);
        throw error;
    }
};

// ✅ PERFECT deleteCourse
export const deleteCourse = async (courseId, token) => {
    try {
        console.log("🗑️ DELETE URL:", COURSE_DELETE_API(courseId));

        const result = await apiConnector("DELETE", COURSE_DELETE_API(courseId), null, {
            Authorization: `Bearer ${token}`,
        });

        console.log("✅ Delete result:", result);
        return result;
    } catch (error) {
        console.error("❌ Delete error details:", {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message
        });
        throw error;
    }
};

// mark a lecture as complete
// export const markLectureAsComplete = async (data, token) => {
//     let result = null
//     console.log("mark complete data", data)
//     const toastId = toast.loading("Loading...")
//     try {
//         const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
//             Authorization: `Bearer ${token}`,
//         })
//         console.log(
//             "MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",
//             response
//         )

//         if (!response.data.message) {
//             throw new Error(response.data.error)
//         }
//         toast.success("Lecture Completed")
//         result = true
//     } catch (error) {
//         console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
//         toast.error(error.message)
//         result = false
//     }
//     toast.dismiss(toastId)
//     return result
// }
export const markLectureAsComplete = async (data, token) => {
    let result = false
    const toastId = toast.loading("Loading...")

    try {
        const response = await apiConnector(
            "POST",
            LECTURE_COMPLETION_API,
            data,
            {
                Authorization: `Bearer ${token}`,
            }
        )

        toast.success("Lecture Completed")
        result = true

    } catch (error) {
        console.log("MARK_LECTURE_AS_COMPLETE_API ERROR:", error)
        toast.error(error.message)
    }

    toast.dismiss(toastId)
    return result
}

// create a rating for course
export const createRating = async (data, token) => {
    const toastId = toast.loading("Loading...")
    let success = false
    try {
        const response = await apiConnector("POST", CREATE_RATING_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log("CREATE RATING API RESPONSE............", response)
        if (!response?.data?.success) {
            throw new Error("Could Not Create Rating")
        }
        toast.success("Rating Created")
        success = true
    } catch (error) {
        success = false
        console.log("CREATE RATING API ERROR............", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return success
}

