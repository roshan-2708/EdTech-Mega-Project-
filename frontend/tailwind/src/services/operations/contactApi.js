import { apiConnector } from "../apiConnecter";
import { contactEndpoints } from "../apis";

export const contactUs = async (data) => {
    return apiConnector(
        "POST",
        contactEndpoints.CONTACT_US,
        data
    );
};
