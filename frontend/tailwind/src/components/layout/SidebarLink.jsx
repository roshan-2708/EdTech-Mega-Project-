import React from "react";
import * as Icons from "react-icons/vsc";
import { NavLink } from "react-router-dom";

const SiderLink = ({ link, iconName }) => {
    const Icon = Icons[iconName];

    return (
        <NavLink
            to={link.path}
            className={({ isActive }) =>
                `relative flex items-center gap-x-2 px-6 py-2 text-sm font-medium
         ${isActive ? "bg-yellow-25 text-yellow-50" : "text-richblack-300"}`
            }
        >
            {({ isActive }) => (
                <>
                    <span
                        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-5
              ${isActive ? "opacity-100" : "opacity-0"}`}
                    />
                    <Icon className="text-lg" />
                    <span>{link.name}</span>
                </>
            )}
        </NavLink>
    );
};

export default SiderLink;
