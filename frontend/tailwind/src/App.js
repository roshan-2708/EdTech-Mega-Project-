import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/universal/Navbar";
import About from "./pages/About";
import Login from "./pages/Login";
import VerifyEmail from "./pages/verifyEmail";
import Signup from "./pages/Signup";
function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-800 flex flex-col font-inter">
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
