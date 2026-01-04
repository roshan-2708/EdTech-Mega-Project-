// services/operations/courseAPI.js
import { apiConnector } from "../apiConnecter"; // ✅ FIXED import

// ✅ FIXED: RELATIVE PATHS (apiConnector handles baseURL + /api/v1)
const CREATE_COURSE_API = `/course/createCourse`;
const UPDATE_COURSE_API = `/course/updateCourse`;
const INSTRUCTOR_COURSES_API = `/course/instructor-courses`;
const COURSE_DETAILS_API = (courseId) => `/course/getFullCourseDetails/${courseId}`;
const COURSE_DELETE_API = (courseId) => `/course/${courseId}`; // ✅ PERFECT!

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

export const updateCourse = async (courseData, token, courseId) => {
    try {
        const formData = new FormData();
        formData.append("courseName", courseData.courseName);
        formData.append("courseDescription", courseData.courseDescription);
        formData.append("price", courseData.coursePrice);
        formData.append("tag", courseData.courseTags);
        formData.append("whatYouWillLearn", courseData.whatYouWillLearn || courseData.courseBenefits);
        formData.append("category", courseData.courseCategory);
        formData.append("courseId", courseId);
        formData.append("status", courseData.status || "Draft");

        if (courseData.thumbnail) {
            formData.append("thumbnailImage", courseData.thumbnail);
        }

        // ✅ FIXED: NO manual Content-Type
        const result = await apiConnector("PUT", UPDATE_COURSE_API, formData, {
            Authorization: `Bearer ${token}`,
        });

        return result.data;
    } catch (error) {
        console.error("❌ UpdateCourse error:", error);
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
