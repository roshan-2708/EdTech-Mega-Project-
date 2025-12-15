import { combineReducers } from "redux";
import authReducer from "../slice/AuthSlice";   // ← YOU MUST IMPORT THIS
import profileReducer from '../slice/profileSlice'
import cartReducer from '../slice/cartSlice'
const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer
});

export default rootReducer;
