import { apiConnector } from "../apiConnecter"
import { profileEndpoints } from "../apis";

export async function getUserEnrolledCourses(token) {
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
    }
    return result;
}

export async function getInstructorData(token) {
    let result = [];

    try {
        const response = await apiConnector("GET", profileEndpoints.GET_INSTRUCTOR_DATA, null,
            {
                Authorization: `Bearer ${token}`,

            }
        )
        console.log("GET_INSTRUCTOR_API_RESPONSE", response);
        result = response?.data?.courses;
    } catch (error) {
        console.log("GET_INSTRUCTOR_API API ERROR............", error);
    }
    return result;
}
