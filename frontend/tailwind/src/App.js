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
import MyCourses from "./pages/MyCourses";
import AddCourse from "./pages/addCourse/AddCourse";
import EditCourseDetails from "./pages/EditCourse/EditCourseDetails";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/addCourse/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import { ACCOUNT_TYPE } from "./utils/constants";
import VideoDetails from "./pages/VideoDetails";
import { useSelector } from "react-redux";
import InstructorDashBoard from "./pages/InstructorDashBoard";
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
