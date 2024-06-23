import React, { useState, useEffect, useContext } from "react";
import { MdFormatListBulleted } from "react-icons/md";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import "react-multi-date-picker/styles/colors/red.css";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { MdCalendarToday } from "react-icons/md";
import "react-circular-progressbar/dist/styles.css";
import { NavLink } from "react-router-dom";
import CountUp from "react-countup";
import "./App.css";
import { motion } from "framer-motion";
import { axiosInstance } from "./axios";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import { LuListX } from "react-icons/lu";
import { PiUserListBold } from "react-icons/pi";
import { UserContext } from "./UserContext";

const Home = () => {
  const [userData, setUserData] = useState({
    departmentCount: { Software: 0, IOT: 0, Planning: 0 },
    totalAttendanceCount: 0,
    leaveList: 0,
  });

  const [departments, setDepartments] = useState([]);

  const [totalEmployeesPerDept, setTotalEmployeesPerDept] = useState({
    Software: 0,
    IOT: 0,
    Planning: 0,
  });
  const [employeeData, setEmployeeData] = useState({ totalCount: 0 });
  // const [dates, setDates] = useState([]);
  // const [showDatePicker, setShowDatePicker] = useState(false);
  // const addItemToArray = [];

  // let result;
  const { user } = useContext(UserContext);

  // const handleOkClick = async () => {
  //   if (dates.length === 0) {
  //     alert("Select Some Date");
  //     return;
  //   }

  //   const addItemToArray = dates.map((date) => date.format("YYYY-MM-DD"));
  //   const dates2 = { dates: addItemToArray };

  //   if (dates2.dates.length > 0) {
  //     try {
  //       const result = await axiosInstance.post("/holidays/add", dates2);
  //       console.log(result);
  //     } catch (error) {
  //       console.error("Error sending data:", error);
  //       alert("An error occurred while sending the data. Please try again.");
  //     }
  //   } else {
  //     alert("Choose something to send");
  //   }
  // };
  // const handleResetClick = () => {
  //   console.log(addItemToArray);
  // };
  // const currentYear = new Date().getFullYear();

  useEffect(() => {
    axiosInstance
      .get("/departments/")
      .then((response) => {
        setDepartments(response?.data?.data || []);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const totalEmployees = departments.reduce((acc, dept) => {
      acc[dept.deptName] = (acc[dept.deptName] || 0) + dept.totalCount;
      return acc;
    }, {});

    setTotalEmployeesPerDept(totalEmployees);
  }, [departments]);

  useEffect(() => {
    axiosInstance
      .get("/users")
      .then((response) => setEmployeeData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/userCount")
      .then((response) => {
        const data = response.data;
        data.departmentCount = data.departmentCount || {
          Software: 0,
          IOT: 0,
          Planning: 0,
        };
        setUserData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const cardVariants = {
    initial: { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" },
  };

  const renderCircularProgress = (title, departmentCount) => {
    if (user.role === 3000) {
      if (user.department !== title) {
        return null;
      }
    }

    const totalEmployees = totalEmployeesPerDept[title] || 1;
    const departmentAttendance = departmentCount || 0;
    const percentage = totalEmployees
      ? (departmentAttendance / totalEmployees) * 100
      : 0;

    return (
      <div
        className="chart p-4 shadow rounded-md mt-12"
        style={{ width: "200px", height: "200px" }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <AnimatedProgressProvider
            valueStart={0}
            valueEnd={percentage}
            duration={1}
            easingFunction={easeQuadInOut}
            repeat
          >
            {(value) => {
              const roundedValue = Math.round(value);
              return (
                <CircularProgressbar
                  value={value}
                  text={roundedValue > 0 ? `${roundedValue}%` : ""}
                  styles={buildStyles({
                    textColor: "white",
                    pathColor: roundedValue > 0 ? "#E1FF3C" : "transparent",
                    trailColor: "gray",
                    pathTransition: "none",
                    transition: "stroke-dashoffset 0.5s ease 0s",
                    rotation: 0.25,
                    strokeLinecap: "butt",
                    textSize: "20px",
                  })}
                />
              );
            }}
          </AnimatedProgressProvider>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              textAlign: "center",
              fontSize: "12px",
              color: "white",
              paddingTop: "40px",
            }}
          >
            {title}
          </div>
        </div>
      </div>
    );
  };

  const departmentAttendance = {
    Software: userData.departmentCount?.Software || 0,
    IOT: userData.departmentCount?.IOT || 0,
    Planning: userData.departmentCount?.Planning || 0,
  };

  return (
    <main className="main-container p-5">
      <h1 className="text-2xl font-bold font-monaSansItalic">Dashboard</h1>
      <div className="mt-6 mb-3 flex justify-between items-start ">
        <div>
          <p className="font-epilogueLight inline text-1xl">
            Manage your teams well for a productive day!
          </p>
        </div>
        {/* <div>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="bg-black text-white py-1 px-2 border-solid border-black border-[1px]"
          >
            <MdCalendarToday />
          </button>
          {showDatePicker && (
            <div>
              <DatePicker
                value={dates}
                onChange={setDates}
                format="YYYY-MM-DD"
                sort
                className="red bg-dark full-width-datepicker"
                plugins={[<DatePanel />]}
                placeholder="select holidays"
                minDate={new Date(currentYear, 0, 1)}
              >
                <div className="flex justify-between items-center">
                  <button
                    className="bg-white text-black py-1 px-2 border-solid border-black border-[1px]"
                    onClick={handleOkClick}
                  >
                    OK
                  </button>
                  <button
                    className="bg-white text-black py-1 px-2 border-solid border-black border-[1px]"
                    onClick={handleResetClick}
                  >
                    Reset
                  </button>
                </div>
              </DatePicker>
            </div>
          )}
        </div> */}
      </div>
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 mt-16">
        <motion.div
          className="card-wrapper"
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
        >
          <NavLink to="/employee" className="card p-4 shadow rounded-lg">
            <div className="card-inner flex items-center justify-between border-[#E1FF3C]">
              <h6 className="text-white">Total </h6>
              <PiUserListBold className="card_icon text-white" />
            </div>
            <div className="flex justify-between">
              <h1 className="text-2xl text-[#E1FF3C] ">
                <CountUp end={employeeData.totalCount} duration={1} />
              </h1>
              <p>Employees</p>
            </div>
          </NavLink>
        </motion.div>

        <motion.div
          className="card-wrapper"
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
        >
          <NavLink to="/attendance" className="card p-4 shadow rounded-md">
            <div className="card-inner flex items-center justify-between">
              <h6 className="text-white">Attendance</h6>
              <MdFormatListBulleted className="card_icon text-white" />
            </div>
            <div className="flex justify-between">
              <h1 className="text-2xl text-[#E1FF3C]">
                <CountUp end={userData.totalAttendanceCount} duration={1} />
              </h1>
              <p>Employees</p>
            </div>
          </NavLink>
        </motion.div>

        <motion.div
          className="card-wrapper"
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
        >
          <NavLink to="/leave" className="card p-4 shadow rounded-md">
            <div className="card-inner flex items-center justify-between">
              <h6 className="text-white">Leave</h6>
              <LuListX className="card_icon text-white" />
            </div>
            <div className="flex justify-between">
              <h3 className="text-2xl text-[#E1FF3C]">
                <CountUp end={userData.leaveList} duration={1} />
              </h3>
              <p>Employees</p>
            </div>
          </NavLink>
        </motion.div>

        {renderCircularProgress("Planning", departmentAttendance["Planning"])}
        {renderCircularProgress("Software", departmentAttendance["Software"])}
        {renderCircularProgress("IOT", departmentAttendance["IOT"])}
      </div>
    </main>
  );
};

export default Home;
