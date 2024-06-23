import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Bar from "./Bar";
import Home from "./Home";
import Leave from "./Leave";
import Employee from "./Employee";
import Attendance from "./Attendance";
import Profile from "./Profile";
import Payroll from "./Payroll";
import Login from "./Login";
import Request from "./Request";
import Detail from "./Detail";

import { UserContext } from "./UserContext";

const RouteWrapper = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const { user } = useContext(UserContext);

  // useEffect(() => {
  //   if (user) {
  //     setIsLoggedIn(true);
  //   }
  // }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem(isLoggedIn);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen overflow-hidden">
        {isLoggedIn && <Navbar />}
        <div className="flex flex-grow overflow-hidden">
          {isLoggedIn && <Bar />}
          <div className="flex-grow p-4 overflow-auto">
            <Routes>
              {!isLoggedIn && (
                <Route
                  path="/"
                  element={<Login onLogin={() => setIsLoggedIn(true)} />}
                />
              )}
              {isLoggedIn && (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/leave" element={<Leave />} />
                  <Route path="/employee" element={<Employee />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/request" element={<Request />} />
                  <Route path="/detail/:id" element={<Detail />} />
                </>
              )}
              <Route
                path="/login"
                element={<Login onLogin={() => setIsLoggedIn(true)} />}
              />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default RouteWrapper;
