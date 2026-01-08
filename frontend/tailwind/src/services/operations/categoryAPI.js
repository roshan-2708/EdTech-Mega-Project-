// import { apiConnector } from "../apiConnecter";
// const BASE_URL = process.env.REACT_APP_BASE_URL;
// export const getAllCategories = () => {
//     return apiConnector("GET", "/category/all");
// };
// export const categories = {
//     CATEGORY_API: `${BASE_URL}/category/all`,
// };

// src/services/operations/categoryAPI.js
import { apiConnector } from "../apiConnecter";
import { categoryEndpoints } from "../apis";

export const getAllCategories = () => {
    return apiConnector("GET", categoryEndpoints.GET_ALL_CATEGORIES);
};

