import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../slice/AuthSlice"; 

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
      dispatch(setToken(token));

      navigate("/dashboard/my-profile");
    } else {
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-richblack-900">
      <div className="spinner"></div> 
    </div>
  );
}