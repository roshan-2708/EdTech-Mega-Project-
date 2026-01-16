import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/AuthSlice";
import viewCourseReducer from "../slice/viewCourseSlice";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        viewCourse: viewCourseReducer,
    },
});
