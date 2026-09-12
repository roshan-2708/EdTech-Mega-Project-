import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/AuthSlice";
import viewCourseReducer from "../features/video/viewCourseSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        viewCourse: viewCourseReducer,
    },
});
