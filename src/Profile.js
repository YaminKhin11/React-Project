// import React, { useContext, useState, useEffect } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import Photo from "./images/profile.jpg";
// import { UserContext } from "./UserContext";
// import { axiosInstance } from "./axios";

// const Modal = ({ show }) => {
//   if (!show) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-md shadow-lg text-center">
//         <h2 className="text-xl font-bold mb-4 text-black">
//           Change Password Successful
//         </h2>
//       </div>
//     </div>
//   );
// };

// const Profile = () => {
//   const { user } = useContext(UserContext);
//   const [showModal, setShowModal] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     oldPassword: "",
//     newPassword: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [name]: value,
//     }));
//   };

//   const handleReset = () => {
//     if (user && user.userData) {
//       setFormData({
//         username: user.userData.username,
//         email: user.userData.email,
//         oldPassword: "",
//         newPassword: "",
//       });
//     }
//   };

//   const handleChangePassword = async () => {
//     if (formData.newPassword.trim() !== "") {
//       try {
//         const response = await axiosInstance.post(
//           "/users/resetPassword",
//           formData
//         );
//         console.log("Password change successful:", response.data);
//         setShowModal(true);
//       } catch (error) {
//         console.error("There was a problem with the axios operation:", error);
//       }
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prevState) => !prevState);
//   };

//   const toggleNewPasswordVisibility = () => {
//     setShowNewPassword((prevState) => !prevState);
//   };

//   useEffect(() => {
//     if (user && user.userData) {
//       setFormData({
//         username: user.userData.username,
//         email: user.userData.email,
//         oldPassword: "",
//         newPassword: "",
//       });
//     }
//   }, [user]);

//   useEffect(() => {
//     if (showModal) {
//       const timer = setTimeout(() => {
//         setShowModal(false);
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, [showModal]);

//   return (
//     formData && (
//       <main className="main-container p-4 sm:p-6 md:p-10 ">
//         <h1 className="text-2xl font-bold md:text-left my-0">Profile</h1>
//         <div className="flex items-center justify-center">
//           <img
//             src={Photo}
//             alt="User Profile"
//             className="rounded-full h-[150px] w-[150px] sm:h-[200px] sm:w-[200px] object-cover"
//           />
//         </div>
//         <div className="flex justify-center items-center my-10">
//           <div className="border  border-[#E1FF3C] rounded-md p-4 sm:p-8 shadow-lg backdrop-filter backdrop-blur-sm relative bg-transparent w-full max-w-sm  ">
//             <div className="my-2">
//               <label className="block mb-2 text-sm font-medium text-white">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 readOnly
//                 className="block w-full px-3 py-2 border rounded-md focus:outline-none text-black focus:border-[#E1FF3C]"
//               />
//             </div>
//             <div className="my-2">
//               <label className="block mb-2 text-sm font-medium text-white">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 readOnly
//                 className="block w-full px-3 py-2 border rounded-md focus:outline-none text-black focus:border-[#E1FF3C]"
//               />
//             </div>
//             <div className="my-2">
//               <label className="block mb-2 text-sm font-medium text-white">
//                 Current Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="oldPassword"
//                   value={formData.oldPassword}
//                   onChange={handleChange}
//                   className="block w-full px-3 py-2 border rounded-md focus:outline-none text-black focus:border-[#E1FF3C]"
//                 />
//                 <button
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
//                   onClick={togglePasswordVisibility}
//                 >
//                   {showPassword ? <FaEye /> : <FaEyeSlash />}
//                 </button>
//               </div>
//             </div>
//             <div className="my-2">
//               <label className="block mb-2 text-sm font-medium text-white">
//                 New Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showNewPassword ? "text" : "password"}
//                   name="newPassword"
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   className="block w-full px-3 py-2 border rounded-md focus:outline-none text-black focus:border-[#E1FF3C]"
//                 />
//                 <button
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
//                   onClick={toggleNewPasswordVisibility}
//                 >
//                   {showNewPassword ? <FaEye /> : <FaEyeSlash />}
//                 </button>
//               </div>
//             </div>
//             <div className="flex justify-between mt-4">
//               <button
//                 className="bg-[#E1FF3C] hover:bg-[#E1FF3C] text-black font-medium py-2 px-4 rounded-md transition duration-300"
//                 onClick={handleReset}
//               >
//                 Reset
//               </button>
//               <button
//                 className="bg-[#E1FF3C] hover:bg-[#E1FF3C] text-black font-medium py-2 px-4 rounded-md transition duration-300"
//                 onClick={handleChangePassword}
//               >
//                 Change Password
//               </button>
//             </div>
//           </div>
//         </div>
//         <Modal show={showModal} />
//       </main>
//     )
//   );
// };

// export default Profile;

import React, { useContext, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Photo from "./images/profile.jpg";
import { UserContext } from "./UserContext";
import { axiosInstance } from "./axios";

const Modal = ({ show }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4 text-black">
          Change Password Successful
        </h2>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        oldPassword: "",
        newPassword: "",
      });
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword.trim() !== "") {
      try {
        const response = await axiosInstance.post(
          "/users/resetPassword",
          formData
        );

        console.log("Password change successful:", response.data);
        setShowModal(true);
      } catch (error) {
        console.error("There was a problem with the axios operation:", error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showModal]);

  return (
    formData && (
      <main className="main-container p-4 sm:p-6 md:p-10 ">
        <h1 className="text-2xl font-bold md:text-left my-0">Profile</h1>
        <div className="flex items-center justify-center">
          <img
            src={Photo}
            alt="User Profile"
            className="rounded-full h-[150px] w-[150px] sm:h-[200px] sm:w-[200px] object-cover"
          />
        </div>
        <div className="flex justify-center items-center my-10">
          <div className="border  border-[#E1FF3C] rounded-md p-4 sm:p-8 shadow-lg backdrop-filter backdrop-blur-sm relative bg-transparent w-full max-w-sm  ">
            <div className="my-2">
              <label className="block mb-2 text-sm font-medium text-white">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                readOnly
                className="block w-full px-3 py-2 border rounded-md focus:outline-none text-black focus:border-[#E1FF3C]"
              />
            </div>
            <div className="my-2">
              <label className="block mb-2 text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly
                className="block w-full px-3 py-2 border rounded-md focus:outline-none text-black focus:border-[#E1FF3C]"
              />
            </div>
            <div className="my-2">
              <label className="block mb-2 text-sm font-medium text-white">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border rounded-md focus:outline-none text-black focus:border-[#E1FF3C]"
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <div className="my-2">
              <label className="block mb-2 text-sm font-medium text-white">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border rounded-md focus:outline-none text-black focus:border-[#E1FF3C]"
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black"
                  onClick={toggleNewPasswordVisibility}
                >
                  {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-[#E1FF3C] hover:bg-[#E1FF3C] text-black font-medium py-2 px-4 rounded-md transition duration-300"
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className="bg-[#E1FF3C] hover:bg-[#E1FF3C] text-black font-medium py-2 px-4 rounded-md transition duration-300"
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
        <Modal show={showModal} />
      </main>
    )
  );
};

export default Profile;
