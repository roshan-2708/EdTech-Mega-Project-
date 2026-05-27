import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginUser = async () => {
      try {
        // Get token from URL
        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");

        if (!token) {
          navigate("/login");

          return;
        }

        // Save token
        localStorage.setItem("token", token);

        // Fetch profile
        const response = await axios.get(
          "https://edtech-mega-project.onrender.com/api/v1/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const user = response.data.user;

        // Save user
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect based on role
        if (user.accountType === "Student" || user.accountType === "Instructor") {
          navigate("/dashboard/my-profile");
        } 
        else {
          navigate("/");
        }
      } catch (error) {
        console.log("Google Login Error:", error);

        navigate("/login");
      }
    };

    loginUser();
  }, [navigate]);

  return <div className="text-white text-center mt-10">Logging you in...</div>;
};

export default AuthSuccess;
