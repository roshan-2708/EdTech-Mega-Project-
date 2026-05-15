
import { apiConnector } from "../apiConnecter";
import { categoryEndpoints } from "../apis";


// get all category
export const getAllCategories = () => {
    return apiConnector("GET", categoryEndpoints.GET_ALL_CATEGORIES);
};

