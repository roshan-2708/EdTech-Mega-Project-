import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/AuthSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer, // 👈 VERY IMPORTANT KEY NAME
    },
});
