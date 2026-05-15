import { apiConnector } from "../apiConnecter";
import { subSectionEndpoints } from "../apis";

const {
    CREATE_SUBSECTION,
    UPDATE_SUBSECTION,
    DELETE_SUBSECTION,
} = subSectionEndpoints;

// create sub section
export const createSubSection = async (data, token) => {
    const response = await apiConnector("POST", CREATE_SUBSECTION, data, {
        Authorization: `Bearer ${token}`,
    });
    return response.data;
};

// update sub section
export const updateSubSection = async (data, token) => {
    const response = await apiConnector("PUT", UPDATE_SUBSECTION, data, {
        Authorization: `Bearer ${token}`,
    });
    return response.data;
};

// delete sub section
export const deleteSubSection = async (data, token) => {
    const response = await apiConnector("DELETE", DELETE_SUBSECTION, data, {
        Authorization: `Bearer ${token}`,
    });
    return response.data;
};
