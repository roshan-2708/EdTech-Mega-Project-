import { combineReducers } from "redux";
import authReducer from "../slice/AuthSlice";
import profileReducer from "../slice/profileSlice";
import cartReducer from "../slice/cartSlice";
import courseReducer from "../slice/courseSlice";
import viewCourseReducer from "../slice/viewCourseSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    course: courseReducer,
    viewCourse: viewCourseReducer,
});

export default rootReducer;
