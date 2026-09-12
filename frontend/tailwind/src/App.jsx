import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/layout/Navbar";
import About from "./pages/About";
import Login from "./features/auth/pages/Login";
import VerifyEmail from "./features/auth/pages/VerifyEmail";
import Signup from "./features/auth/pages/Signup";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import UpdatePassword from "./features/auth/pages/UpdatePassword";
import Contact from "./pages/Contact";
import MyProfile from "./features/profile/pages/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/auth/PrivateRoute";
import Settings from "./features/profile/pages/Settings";
import EnrollCourses from "./features/courses/pages/EnrollCourses";
import Cart from "./features/cart/pages/Cart";
import MyCourses from "./features/courses/pages/MyCourses";
import AddCourse from "./features/courseBuilder/pages/AddCourse";
import EditCourseDetails from "./features/courseBuilder/pages/EditCourseDetails";
import Catalog from "./features/courses/pages/Catalog";
import CourseDetails from "./features/courseBuilder/components/CourseDetails";
import ViewCourse from "./features/courses/pages/ViewCourse";
import { ACCOUNT_TYPE } from "./utils/constants";
import VideoDetails from "./features/video/pages/VideoDetails";
import { useSelector } from "react-redux";
import InstructorDashBoard from "./features/instructor/pages/InstructorDashboard";
function App() {
  const { user } = useSelector((state) => state.profile);

  return (
    <div className="min-h-96 w-screen bg-richblack-900 font-inter text-white">
      {/* TOASTER */}
      <Toaster position="top-center" />

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/update-password/:id" element={<UpdatePassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/catalog/:name" element={<Catalog />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />

          {/* VIEW COURSE */}
          <Route
            path="view-course/:courseId"
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          >
            <Route
              path="section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          </Route>

          {/* DASHBOARD */}
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
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route
              path="edit-course/:courseId"
              element={<EditCourseDetails />}
            />
            <Route path="Instructor" element={<InstructorDashBoard />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
