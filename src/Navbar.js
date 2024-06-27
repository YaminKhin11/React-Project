import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";

import LogoImage from "./images/lg.png";
import { UserContext } from "./UserContext";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  const isLoginPage = location.pathname === "/login";
  const goToProfile = () => {
    navigate("/profile");
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    user && (
      <section className={`${isLoginPage ? "hidden" : ""} w-full`}>
        <nav className="bg-[#0e0e0e] p-3 h-14 w-full flex justify-between items-center">
          <img src={LogoImage} alt="Staff" className="h-12" />
          <div className="flex items-center gap-4">
            <div
              className="relative cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={goToProfile}
            >
              <img
                src={user.profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full inline"
              />

              {isHovered && (
                <div className="absolute top-12 right-0 bg-white p-4 rounded-md shadow-lg">
                  <div className="text-sm font-medium text-black">
                    {" "}
                    {user.username}
                  </div>
                  <div className="text-sm text-gray-500"> {user.email}</div>
                </div>
              )}
            </div>
            <span className="text-white font-bold"> {user.username}</span>
            <button
              className="flex items-center text-sm gap-2 font-medium p-2 hover:bg-gray-800 rounded-md text-black bg-white"
              onClick={handleLogout}
            >
              <span>Logout</span>
              <HiOutlineLogout size={20} className="inline" />
            </button>
          </div>
        </nav>
      </section>
    )
  );
};

export default Navbar;
