// services/operations/subSectionAPI.js
import { apiConnector } from "../apiConnecter";
import { subSectionEndpoints } from "../apis";
import { toast } from "react-hot-toast";

const {
    CREATE_SUBSECTION,
    UPDATE_SUBSECTION,
    DELETE_SUBSECTION,
} = subSectionEndpoints;

// export const createSubSection = async (data, token) => {
//     const response = await apiConnector("POST", CREATE_SUBSECTION, data, {
//         Authorization: `Bearer ${token}`,
//     });
//     return response.data; // return full data (success, message, data)
// };

export const createSubSection = async (data, token) => {
    // Adding a 5-minute timeout specifically for this heavy upload
    const response = await apiConnector("POST", CREATE_SUBSECTION, data, {
        Authorization: `Bearer ${token}`,
    }, null, { timeout: 300000 }); // 300,000ms = 5 minutes

    return response.data;
};

export const updateSubSection = async (data, token) => {
    const response = await apiConnector("PUT", UPDATE_SUBSECTION, data, {
        Authorization: `Bearer ${token}`,
    });
    return response.data;
};

export const deleteSubSection = async (data, token) => {
    const response = await apiConnector("DELETE", DELETE_SUBSECTION, data, {
        Authorization: `Bearer ${token}`,
    });
    return response.data;
};
