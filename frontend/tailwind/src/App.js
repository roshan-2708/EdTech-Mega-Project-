import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/universal/Navbar";
import About from "./pages/About";
import Login from "./pages/Login";
import VerifyEmail from "./pages/verifyEmail";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Contact from "./pages/Contact";
import MyProfile from "./components/core/HomePage/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Settings from "./pages/Settings";
import EnrollCourses from "./pages/EnrollCourses";
import Cart from "./pages/cart/Index";
import MyCourses from './pages/MyCourses'
import AddCourse from "./pages/addCourse/AddCourse";
import EditCourseDetails from "./pages/EditCourse/EditCourseDetails";
import Catalog from "./pages/Catalog";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-800 flex flex-col font-inter">
      <Toaster position="top-center" />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/update-password/:id" element={<UpdatePassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/catalog/:name" element={<Catalog />} />
        {/* ✅ DASHBOARD ROUTES */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="enrolled-courses" element={<EnrollCourses />} />
          <Route path="cart" element={<Cart />} />
          <Route path="/dashboard/my-courses" element={<MyCourses></MyCourses>} />
          <Route path="/dashboard/add-course" element={<AddCourse />}></Route>
          <Route path="/dashboard/edit-course/:courseId" element={<EditCourseDetails />} />
          
        </Route>
      </Routes>
    </div>
  );
}

export default App;
