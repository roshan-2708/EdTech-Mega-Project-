
import { apiConnector } from "../apiConnecter";
import { sectionEndpoints } from "../apis";
import { toast } from "react-hot-toast";

const { CREATE_SECTION, UPDATE_SECTION, DELETE_SECTION } = sectionEndpoints;

// create section
export const createSection = async (data, token) => {
    try {
        const response = await apiConnector("POST", CREATE_SECTION, data, {
            Authorization: `Bearer ${token}`,
        });
        toast.success("Section created successfully!");
        return response.data.data; // Populated course
    } catch (error) {
        console.error("CreateSection error:", error);
        toast.error(error.response?.data?.message || "Failed to create section");
        throw error;
    }
};

// update section
export const updateSection = async (data, token) => {
    try {
        const response = await apiConnector("PUT", UPDATE_SECTION, data, {
            Authorization: `Bearer ${token}`,
        });
        toast.success("Section updated successfully!");
        return response.data.data; // Populated course
    } catch (error) {
        console.error("UpdateSection error:", error);
        toast.error(error.response?.data?.message || "Failed to update section");
        throw error;
    }
};

// delete section
export const deleteSection = async (data, token) => {
    try {
        const response = await apiConnector("DELETE", DELETE_SECTION, data, {
            Authorization: `Bearer ${token}`,
        });
        toast.success("Section deleted successfully!");
        return response.data.data; // Populated course
    } catch (error) {
        console.error("DeleteSection error:", error);
        toast.error(error.response?.data?.message || "Failed to delete section");
        throw error;
    }
};
