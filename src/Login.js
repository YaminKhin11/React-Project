import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { UserContext } from "./UserContext";
import { axiosInstance } from "./axios";

Modal.setAppElement("#root");

function Login({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState(""); // State to store login message
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  const { addUser } = useContext(UserContext);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post("/login/loginUser", data);
      if (response.status === 200) {
        //  if user 1000
        if (response.data.userData.role === 1000) {
          setLoginMessage("User can't login");
          return;
        }
        const accesstoken = response.data.accessToken;
        const refreshtoken = response.data.refreshToken;
        localStorage.setItem("accessToken", accesstoken);
        localStorage.setItem("refreshToken", refreshtoken);
        console.log("accesstoken:", accesstoken, "refreshtoken:", refreshtoken);
        addUser(response.data);
        onLogin();
        setLoginMessage("Login successful"); // Set login message to "Login successful"
        navigate("/");
      } else {
        setLoginMessage("Login failed"); // Set login message to "Login failed"
      }
    } catch (error) {
      setLoginMessage("Login failed"); // Set login message to "Login failed" in case of error
    } finally {
      setModalIsOpen(true);
    }
  };

  useEffect(() => {
    if (modalIsOpen) {
      const timer = setTimeout(() => {
        setModalIsOpen(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [modalIsOpen]);

  return (
    <main className="main-container flex items-center justify-center min-h-screen">
      <div className="border border-highlight rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm  relative bg-transparent w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h3 className="text-white font-bold text-xl mb-6">Welcome back</h3>
          </div>
          <div>
            <h3 className="text-white font-bold text-xl mb-2">Login</h3>
          </div>
          <div className="my-4 relative">
            <label
              htmlFor="employeeId"
              className="block text-white text-sm mb-1"
            >
              EmployeeId
            </label>
            <div className="flex items-center border border-[#E1FF3C] rounded-md overflow-hidden relative">
              <input
                id="employeeId"
                name="employeeId"
                type="text"
                className={`w-full px-4 py-2 text-sm text-white bg-transparent focus:outline-none ${
                  errors.employeeId && "border-red-500"
                }`}
                {...register("employeeId", { required: true })}
                placeholder="employeeId"
              />
              <FaUser className="text-gray-400 absolute right-0 top-0 bottom-0 m-auto mr-3" />
            </div>
            {errors.username && (
              <div className="text-[#ff6774] text-[10px]">
                Userid is required
              </div>
            )}
          </div>
          <div className="my-6 relative">
            <label htmlFor="password" className="block text-white text-sm mb-1">
              Password
            </label>
            <div className="flex items-center border border-[#E1FF3C] rounded-md overflow-hidden relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-2 text-sm text-white bg-transparent focus:outline-none pr-8 ${
                  errors.password && "border-red-500"
                }`}
                {...register("password", {
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                })}
                placeholder="Password"
              />

              {showPassword ? (
                <FaEye
                  className="text-gray-400 absolute right-0 top-0 bottom-0 m-auto mr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaEyeSlash
                  className="text-gray-400 absolute right-0 top-0 bottom-0 m-auto mr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            {errors.password && (
              <div className="text-[#ff6774] text-[10px]">
                {errors.password.type === "required" && "Password is required"}
                {errors.password.type === "minLength" &&
                  "Password must be at least 5 characters"}
                {errors.password.type === "maxLength" &&
                  "Password must be at most 20 characters"}
              </div>
            )}
          </div>
          <div className="my-8 flex justify-center">
            <button className="w-[100px] text-[10px] rounded-full bg-[#E1FF3C] text-black hover:bg-black hover:text-[#E1FF3C] py-3 transition-colors duration-300">
              Login
            </button>
          </div>
        </form>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Login Status"
        className="flex justify-center items-center min-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="bg-white p-8 rounded-md shadow-lg text-center">
          <h2 className="text-2xl mb-4">{loginMessage}</h2>
        </div>
      </Modal>
    </main>
  );
}

export default Login;
