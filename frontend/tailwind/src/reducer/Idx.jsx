import { combineReducers } from "redux";
import authReducer from "../slice/AuthSlice";
import profileReducer from '../slice/profileSlice';
import cartReducer from '../slice/cartSlice';
import courseReducer from '../slice/courseSlice'; // ✅ renamed for clarity

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    course: courseReducer, // ✅ match the import
});

export default rootReducer;
