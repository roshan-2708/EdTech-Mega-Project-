import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courseSectionData: [],
    courseEntireData: null,
    completedLectures: [],
    totalNoOfLectures: 0,

    isCourseLoading: true,
    isProgressLoading: true,
};

const viewCourseSlice = createSlice({
    name: "viewCourse",
    initialState,
    reducers: {
        startCourseLoading: (state) => {
            state.isCourseLoading = true;
            state.isProgressLoading = true;
        },
        setCourseSectionData: (state, action) => {
            state.courseSectionData = action.payload;
        },
        setEntireCourseData: (state, action) => {
            state.courseEntireData = action.payload;
            state.isCourseLoading = false;
        },
        setTotalNoOfLectures: (state, action) => {
            state.totalNoOfLectures = action.payload;
        },
        setCompletedLectures: (state, action) => {
            state.completedLectures = action.payload;
            state.isProgressLoading = false;
        },
        updateCompletedLectures: (state, action) => {
            const lectureId = action.payload;
            if (lectureId && !state.completedLectures.includes(lectureId)) {
                state.completedLectures.push(lectureId);
            }
        },
        resetViewCourse: () => initialState,
    },
});

export const {
    startCourseLoading,
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
    setCompletedLectures,
    updateCompletedLectures,
    resetViewCourse,
} = viewCourseSlice.actions;

export default viewCourseSlice.reducer;
