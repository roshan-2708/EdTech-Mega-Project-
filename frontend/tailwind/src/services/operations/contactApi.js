import { apiConnector } from "../apiConnecter";
import { contactEndpoints } from "../apis";


// contact us
export const contactUs = async (data) => {
    return apiConnector(
        "POST",
        contactEndpoints.CONTACT_US,
        data
    );
};
