import { apiConnector } from "../apiConnecter"
import { authEndpoints } from "../apis"
import { profileEndpoints } from "../apis";
import { toast } from "react-hot-toast"

export async function getUserEnrolledCourses(token) {
    const toastId = toast.loading("Loading...");
    let result = [];
    try {
        const response = await apiConnector(
            "GET",
            profileEndpoints.GET_ENROLLED_COURSES,
            null,
            { Authorization: `Bearer ${token}` }
        );

        if (!response.data.success) throw new Error(response.data.message);
        result = response.data.data;
    } catch (error) {
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error);
        toast.error("Could Not Get Enrolled Courses");
    }
    toast.dismiss(toastId);
    return result;
}

export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...");

    let result = [];

    try {
        const response = await apiConnector("GET", "/profile/instructorDashboard", null,
            {
                Authorization: `Bearer ${token}`,

            }
        )
        console.log("GET_INSTRUCTOR_API_RESPONSE", response);
        result = response?.data?.courses;
    } catch (error) {
        console.log("GET_INSTRUCTOR_API API ERROR............", error);
        toast.error("Could Not Get Instructor Courses");
    }
    toast.dismiss(toastId);
    return result;
}
