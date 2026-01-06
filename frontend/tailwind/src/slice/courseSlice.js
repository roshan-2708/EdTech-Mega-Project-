import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    step: 1,
    course: {
        courseContent: [],
    },
    editCourse: false,
    paymentLoading: false,
};


const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setStep: (state, action) => {
            state.step = action.payload;
        },
        // setCourse: (state, action) => {
        //     state.course = action.payload;
        // },
        setCourse: (state, action) => {
            const courseData = action.payload;

            state.course = {
                ...courseData,
                id: courseData._id || courseData.id, // ✅ normalize once
                courseContent: courseData.courseContent || [],
            };
        },

        setEditCourse: (state, action) => {
            state.editCourse = action.payload;
        },
        setPaymentLoading: (state, action) => {
            state.paymentLoading = action.payload;
        },
        resetCourseState: () => initialState, // ✅ clean reset
    },
});

export const {
    setStep,
    setCourse,
    setEditCourse,
    setPaymentLoading,
    resetCourseState,
} = courseSlice.actions;

export default courseSlice.reducer;
