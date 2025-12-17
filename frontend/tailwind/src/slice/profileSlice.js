import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
            localStorage.removeItem("user");
        },
    },
});

export const { setUser, clearUser } = profileSlice.actions;
export default profileSlice.reducer;
