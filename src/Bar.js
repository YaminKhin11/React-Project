import React, { useContext, useEffect } from "react";
import { IoHome } from "react-icons/io5";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdFormatListBulleted } from "react-icons/md";
import { LuListX } from "react-icons/lu";
import { PiUserListBold } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

const Bar = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    if (user) {
      setMenus([
        {
          name: "Dashboard",
          path: "/",
          icon: IoHome,
        },
        {
          name: "Employee List",
          path: "/employee",
          icon: PiUserListBold,
        },
        {
          name: "Attendance ",
          path: "/attendance",
          icon: MdFormatListBulleted,
        },
        {
          name: "Leave List",
          path: "/leave",
          icon: LuListX,
        },
        {
          name: "Payroll",
          path: "/payroll",
          icon: FaMoneyCheckDollar,
          isHide: user.role === 3000,
        },
        { name: "Profile", path: "/profile", icon: CgProfile },
      ]);
    }
  }, [user]);

  const [open, setOpen] = useState(true);
  const isLoginPage = location.pathname === "/login";
  return (
    <div className={`flex-shrink-0 ${isLoginPage ? "hidden" : ""}`}>
      <div
        className={`bg-[#0e0e0e] h-full  ${
          open ? "w-56" : "w-16"
        } duration-500 text-gray-400 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {user &&
            menus.map(
              (menu, i) =>
                !menu.isHide && (
                  <NavLink
                    to={menu.path}
                    className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md mt-5 ${
                      location.pathname === menu.path
                        ? "bg-[#E1FF3C] text-black"
                        : ""
                    }`}
                    key={i}
                  >
                    <div>{React.createElement(menu.icon, { size: 20 })}</div>
                    <h2
                      style={{ transitionDelay: `${i + 3}00ms` }}
                      className={`whitespace-pre duration-500 ${
                        !open && "opacity-0 translate-x-28 overflow-hidden"
                      }`}
                    >
                      {menu.name}
                    </h2>
                    <h2
                      className={`${
                        open && "hidden"
                      } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-lg drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
                    >
                      {menu.name}
                    </h2>
                  </NavLink>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default Bar;
