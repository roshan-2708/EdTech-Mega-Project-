import { combineReducers } from "redux";
import authReducer from "../features/auth/AuthSlice";
import profileReducer from "../features/profile/profileSlice";
import cartReducer from "../features/cart/cartSlice";
import courseReducer from "../features/courses/courseSlice";
import viewCourseReducer from "../features/video/viewCourseSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    course: courseReducer,
    viewCourse: viewCourseReducer,
});

export default rootReducer;
