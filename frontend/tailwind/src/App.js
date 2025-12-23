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
import PrivateRoute from './components/core/auth/PrivateRoute'
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

        {/* ✅ NESTED DASHBOARD ROUTES */}
        <Route path="/dashboard" element={<PrivateRoute>
          <Dashboard />
        </PrivateRoute>}>
          <Route path="my-profile" element={<MyProfile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
