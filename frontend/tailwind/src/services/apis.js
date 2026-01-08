// src/apis/index.js
const BASE_URL = process.env.REACT_APP_BASE_URL

// ✅ Auth endpoints

// src/apis/index.js

export const authEndpoints = {
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",

    CHANGE_PASSWORD: "/auth/change-password",
    DELETE_ACCOUNT: "/auth/delete-account",

    // ✅ ADD THESE
    RESET_PASSWORD_TOKEN: "/auth/reset-password-token",
    RESET_PASSWORD: "/auth/reset-password",
};


// ✅ Profile endpoints
export const profileEndpoints = {
    PROFILE_IMAGE: "/profile/update-display-picture",
    PROFILE_UPDATE: "/profile/update-profile",
};


// ✅ Category endpoints
export const categoryEndpoints = {
    GET_ALL_CATEGORIES: "/category/all",
};

export const catalogData = {
    CATEGORY_PAGEDATA_API : "/category/details"
}

// ✅ Contact endpoints
export const contactEndpoints = {
    CONTACT_US: `${BASE_URL}/contact`,
};

export const sectionEndpoints = {
    CREATE_SECTION: "/section/create",
    UPDATE_SECTION: "/section/update",
    DELETE_SECTION: "/section/delete",
};

export const subSectionEndpoints = {
    CREATE_SUBSECTION: "/subsection/createSubSection",
    UPDATE_SUBSECTION: "/subsection/updateSubSection",
    DELETE_SUBSECTION: "/subsection/deleteSubSection",
};

export const courseEndpoints = {
    CREATE_COURSE: "/course/createCourse",
    EDIT_COURSE: (courseId) => `/course/${courseId}`,
    GET_ALL_COURSES: "/course/getAllCourses",
    DELETE_COURSE: (courseId) => `/course/${courseId}`,
    GET_INSTRUCTOR_COURSES: "/course/instructor-courses",
    GET_FULL_COURSE_DETAILS: (courseId) => `/course/getFullCourseDetails/${courseId}`,
    GET_COURSE_BY_ID: (courseId) => `/course/getCourseById/${courseId}`,
    ENROLL_IN_COURSE: (courseId) => `/payment/enroll/${courseId}`,
    RATE_COURSE: "/course/rateCourse",
    DELETE_COURSE_ADMIN: (courseId) => `/admin/delete-course/${courseId}`,
};
