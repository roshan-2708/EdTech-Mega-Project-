import React from "react";
import { Link } from "react-router-dom";

const Button = ({ children, active, linkto, onClick }) => {
    // If linkto exists → navigation button
    if (linkto) {
        return (
            <Link to={linkto}>
                <div
                    className={`text-center text-[13px] px-6 py-3 rounded-md font-bold 
          ${active ? "bg-yellow-50 text-black" : "bg-richblack-700 text-white"} 
          transition-all duration-200 hover:scale-95 cursor-pointer`}
                >
                    {children}
                </div>
            </Link>
        );
    }

    // Normal action button 
    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-center text-[13px] px-6 py-3 rounded-md font-bold 
      ${active ? "bg-yellow-50 text-black" : "bg-richblack-700 text-white"} 
      transition-all duration-200 hover:scale-95`}
        >
            {children}
        </button>
    );
};

export default Button;
