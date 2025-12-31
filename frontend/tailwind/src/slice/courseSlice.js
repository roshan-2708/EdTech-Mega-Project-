import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    step: 1,
    course: null,
    editCourses: false,
    paymentLoading: false,
};

const courseslice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setStep: (state, action) => {
            state.step = action.payload; // ✅ step
        },
        setCourse: (state, action) => {
            state.course = action.payload; // ✅ course
        },
        setEditCourse: (state, action) => {
            state.editCourses = action.payload; // ✅ editCourses boolean
        },
        setPaymentLoading: (state, action) => {
            state.paymentLoading = action.payload; // ✅ paymentLoading boolean
        },
        resetCourseState: (state) => {
            state.step = 1;
            state.course = null;
            state.editCourses = false;
            state.paymentLoading = false; // reset paymentLoading too
        },
    },
});

export const { setStep, setCourse, setEditCourse, setPaymentLoading, resetCourseState } = courseslice.actions;

export default courseslice.reducer;
