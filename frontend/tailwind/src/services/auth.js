import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/auth";

export const loginUser = async (email, password) => {
    return await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        {
            withCredentials: true,   // VERY IMPORTANT for cookies
        }
    );
};



export const logoutUser = async () => {
    return await axios.post(
        `${BASE_URL}/logout`,
        {}, // body
        { withCredentials: true } // VERY IMPORTANT to send cookies
    );
};
