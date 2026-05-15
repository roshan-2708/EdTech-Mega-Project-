import toast from "react-hot-toast";
import { apiConnector } from "../apiConnecter";


// get catelog page data
export const getCatalogPageData = async (categoryId) => {
    if (!categoryId) {
        toast.error("Category ID is required");
        return null;
    }

    const toastId = toast.loading("Loading...");
    let result = null;

    try {
        const response = await apiConnector(
            "POST",
            "/category/details",
            { categoryId }
        );


        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not fetch catalog page data");
        }

        result = response.data;
    } catch (error) {
        console.error("Catalog Page Data API Error:", error);
        toast.error(error?.response?.data?.message || error.message);
        result = error?.response?.data || null;
    } finally {
        toast.dismiss(toastId);
    }

    return result;
};
