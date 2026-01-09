import { apiConnector } from "../apiConnecter"
import { authEndpoints } from "../apis"
import { profileEndpoints } from "../apis";

// ================================
// GET ENROLLED COURSES
// ================================
export const getUserEnrolledCourses = async (token) => {
    let result = []
    try {
        const response = await apiConnector(
            "GET",
            profileEndpoints.GET_ENROLLED_COURSES,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );


        // response.data = { success, data }
        result = response?.data?.data
    } catch (error) {
        console.log("GET_ENROLLED_COURSES ERROR:", error)
        throw error
    }
    return result
}