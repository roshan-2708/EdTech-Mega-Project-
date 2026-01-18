
import { apiConnector } from "../apiConnecter";
import { categoryEndpoints } from "../apis";

export const getAllCategories = () => {
    return apiConnector("GET", categoryEndpoints.GET_ALL_CATEGORIES);
};

