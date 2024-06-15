// import React, { useEffect, useState, useRef } from "react";
// import { useTable, usePagination } from "react-table";
// import {
//   FaSearch,
//   FaArrowLeft,
//   FaArrowRight,
//   FaEdit,
//   FaTrash,
//   FaCheck,
//   FaTimes,
//   FaPlus,
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import { axiosInstance } from "./axios";

// const Employee = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [nameFilter, setNameFilter] = useState("");
//   const [idFilter, setIdFilter] = useState("");
//   const [selectedDept, setSelectedDept] = useState("");
//   const [selectedPosition, setSelectedPosition] = useState("");
//   const [totalPages, setTotalPages] = useState(0);
//   const [editingRow, setEditingRow] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newEmployeeData, setNewEmployeeData] = useState({
//     username: "",
//     Email: "",
//     password: "",
//     Gender: "",
//     dOB: "",
//     Role: "",
//     EmployeeId: "",
//     Position: "",
//     Department: "",
//     NRC: "",
//     PhoneNumber: "",
//     Salary: "",
//     AnnualLeave: "",
//     MedicalLeave: "",
//     AttendanceLeave: "",
//   });

//   const inputRefs = useRef([]);

//   useEffect(() => {
//     fetchEmployeeData();
//   }, [page, pageSize, nameFilter, selectedDept, selectedPosition, idFilter]);

//   const fetchEmployeeData = async () => {
//     try {
//       const response = await axiosInstance.get("/users", {
//         params: {
//           username: nameFilter,
//           employeeId: idFilter,
//           department: selectedDept,
//           position: selectedPosition,
//           page: page - 1,
//           size: pageSize,
//         },
//       });
//       setData(response.data.datas);
//       setLoading(false);
//       setTotalPages(response.data.totalPage);
//     } catch (error) {
//       console.error("Error fetching employee data:", error);
//       setLoading(false);
//     }
//   };
//   const submitEmployee = async (newData) => {
//     try {
//       const response = await axiosInstance.post("/users/createUser", newData);
//       console.log(response.data.datas);
//       console.log(newData);
//       fetchEmployeeData();
//       setShowCreateForm(false);
//     } catch (error) {
//       console.error("Error creating employee:", error);
//     }
//   };

//   const handleEdit = (row) => {
//     setEditingRow(row.original.id);
//     setFormData({ ...row.original });
//   };

//   const handleCancelEdit = () => {
//     setEditingRow(null);
//     setFormData({});
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "Department") {
//       setFormData({
//         ...formData,
//         Department: {
//           ...formData.Department,
//           DeptName: value,
//         },
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const {
//         id,
//         DepartmentId,
//         username,
//         EmployeeId,
//         Position,
//         Department,
//         NRC,
//         PhoneNumber,
//         Salary,
//         AnnualLeave,
//         MedicalLeave,
//         AttendanceLeave,
//       } = formData;
//       if (!id) {
//         console.error("Employee ID is missing.");
//         return;
//       }
//       const updatedDataPayload = {
//         username: username,
//         position: Position,
//         employeeId: EmployeeId,
//         phoneNumber: PhoneNumber,
//         salary: parseInt(Salary),
//         departmentName: Department?.DeptName,
//         nrc: NRC,
//         annualLeave: parseInt(AnnualLeave),
//         medicalLeave: parseFloat(MedicalLeave),
//         attendanceLeave: parseInt(AttendanceLeave),
//         departmentId: parseInt(DepartmentId),
//       };

//       const endpoint = `/users/update/${id}`;
//       await axiosInstance.put(endpoint, updatedDataPayload);
//       fetchEmployeeData();
//       setEditingRow(null);
//     } catch (error) {
//       console.error("Error updating employee data:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const endpoint = `/users/deleteUser/${id}`;
//       await axiosInstance.delete(endpoint);
//       fetchEmployeeData();
//     } catch (error) {
//       console.error("Error deleting employee data:", error);
//     }
//   };

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "No.",
//         accessor: (row, i) => (page - 1) * pageSize + i + 1,
//       },
//       {
//         Header: "Name",
//         accessor: "username",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="username"
//               value={formData.username || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.username
//           ),
//       },
//       {
//         Header: "Employee ID",
//         accessor: "EmployeeId",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="EmployeeId"
//               value={formData.EmployeeId || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.EmployeeId
//           ),
//       },
//       {
//         Header: "Position",
//         accessor: "Position",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="Position"
//               value={formData.Position || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.Position
//           ),
//       },
//       {
//         Header: "Department",
//         accessor: "Department.DeptName",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="Department"
//               value={formData.Department?.DeptName || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.Department?.DeptName
//           ),
//       },
//       {
//         Header: "NRC",
//         accessor: "NRC",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="NRC"
//               value={formData.NRC || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.NRC
//           ),
//       },
//       {
//         Header: "Ph-No",
//         accessor: "PhoneNumber",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="PhoneNumber"
//               value={formData.PhoneNumber || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.PhoneNumber
//           ),
//       },
//       {
//         Header: "Salary",
//         accessor: "Salary",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="Salary"
//               value={formData.Salary || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.Salary
//           ),
//       },
//       {
//         Header: "Annual Leave",
//         accessor: "AnnualLeave",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="AnnualLeave"
//               value={formData.AnnualLeave || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.AnnualLeave
//           ),
//       },
//       {
//         Header: "Medical Leave",
//         accessor: "MedicalLeave",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="MedicalLeave"
//               value={formData.MedicalLeave || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.MedicalLeave
//           ),
//       },
//       {
//         Header: "Attendance Leave",
//         accessor: "AttendanceLeave",
//         Cell: ({ row }) =>
//           editingRow === row.original.id ? (
//             <input
//               ref={(el) => (inputRefs.current[row.index] = el)}
//               name="AttendanceLeave"
//               value={formData.AttendanceLeave || ""}
//               onChange={handleChange}
//               className="w-full p-1"
//             />
//           ) : (
//             row.original.AttendanceLeave
//           ),
//       },
//       {
//         Header: "Action",
//         id: "actions",
//         accessor: "id",
//         Cell: ({ row }) => (
//           <div className="flex space-x-2">
//             {editingRow === row.original.id ? (
//               <>
//                 <FaCheck
//                   className="text-green-500 cursor-pointer"
//                   onClick={handleSave}
//                 />
//                 <FaTimes
//                   className="text-red-500 cursor-pointer"
//                   onClick={handleCancelEdit}
//                 />
//               </>
//             ) : (
//               <>
//                 <FaEdit
//                   className="text-blue-500 cursor-pointer"
//                   onClick={() => handleEdit(row)}
//                 />
//                 <FaTrash
//                   className="text-red-500 cursor-pointer"
//                   onClick={() => handleDelete(row.original.id)}
//                 />
//               </>
//             )}
//           </div>
//         ),
//       },
//     ],
//     [editingRow, formData, page, pageSize]
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     rows,
//     pageOptions,
//     state: { pageIndex },
//     gotoPage,
//   } = useTable(
//     {
//       columns,
//       data,
//       initialState: { pageIndex: page - 1, pageSize },
//       manualPagination: true,
//       pageCount: totalPages,
//     },
//     usePagination
//   );

//   useEffect(() => {
//     gotoPage(page - 1);
//   }, [page, gotoPage]);

//   const renderPageNumbers = () => {
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//       if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
//         pageNumbers.push(
//           <button
//             key={i}
//             onClick={() => setPage(i)}
//             className={`px-3 py-1 rounded ${
//               page === i ? "bg-black text-white" : "bg-white text-black"
//             }`}
//           >
//             {i}
//           </button>
//         );
//       } else if (
//         (i === page - 2 && page > 3) ||
//         (i === page + 2 && page < totalPages - 2)
//       ) {
//         pageNumbers.push(
//           <button key={i} className="px-3 py-1 bg-white text-black rounded">
//             ...
//           </button>
//         );
//       }
//     }
//     return pageNumbers;
//   };

//   const departments = [
//     ...new Set(data.map((employee) => employee.Department?.DeptName)),
//   ];
//   const positions = [...new Set(data.map((employee) => employee.Position))];

//   return (
//     <main className="main-container">
//       <div className="container mx-auto">
//         {loading && (
//           <motion.div
//             initial={{ opacity: 0, rotate: 0 }}
//             animate={{ opacity: 1, rotate: 360 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0, loop: Infinity }}
//             className="my-6 flex items-center "
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               className="animate-spin h-6 w-6 mr-2"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 4.418 3.582 8 8 8v-4c-2.061 0-3.931-.784-5.344-2.069l1.729-1.73zm4.281-4.283L4 14h8c0-4.418-3.582-8-8-8v4c1.172 0 2.26.308 3.219.84z"
//               ></path>
//             </svg>
//             Loading...
//           </motion.div>
//         )}

//         <div>
//           <div className="flex items-center justify-between mt-1">
//             <div className="flex items-center">
//               <h1 className="text-2xl font-bold mr-4">Employee List</h1>
//               <button
//                 onClick={() => setShowCreateForm(true)}
//                 className="bg-blue-500 text-white px-3 py-2 rounded"
//               >
//                 <FaPlus className="inline mr-2" />
//                 Create
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-end mb-4 gap-2">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by name"
//                 value={nameFilter}
//                 onChange={(e) => setNameFilter(e.target.value)}
//                 className="text-black rounded-md"
//               />
//               <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//             </div>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by id"
//                 value={idFilter}
//                 onChange={(e) => setIdFilter(e.target.value)}
//                 className="text-black rounded-md"
//               />
//               <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//             </div>
//             <select
//               value={selectedDept}
//               onChange={(e) => setSelectedDept(e.target.value)}
//               className="text-black rounded-sm"
//             >
//               <option value="">All Departments</option>
//               {departments.map((dept) => (
//                 <option key={dept} value={dept}>
//                   {dept}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedPosition}
//               onChange={(e) => setSelectedPosition(e.target.value)}
//               className="text-black rounded-sm"
//             >
//               <option value="">All Positions</option>

//               {positions.map((pos) => (
//                 <option key={pos} value={pos}>
//                   {pos}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <table
//             className="min-w-full divide-y text-black"
//             {...getTableProps()}
//             style={{ border: "solid 1px black" }}
//           >
//             <thead>
//               {headerGroups.map((headerGroup) => (
//                 <tr {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <th
//                       {...column.getHeaderProps()}
//                       style={{
//                         borderBottom: "solid 3px black",
//                         background: "aliceblue",
//                         color: "black",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {column.render("Header")}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>

//             <tbody {...getTableBodyProps()}>
//               {rows.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr {...row.getRowProps()}>
//                     {row.cells.map((cell) => {
//                       return (
//                         <td
//                           {...cell.getCellProps()}
//                           style={{
//                             padding: "10px",
//                             border: "solid 1px gray",
//                             background: "#E1FF3C",
//                           }}
//                         >
//                           {cell.render("Cell")}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           <div className="pagination fixed bottom-4 right-4 flex items-center">
//             <span className="px-2 ">
//               Page{" "}
//               <strong>
//                 {pageIndex + 1} of {pageOptions.length}
//               </strong>{" "}
//             </span>
//             <button
//               onClick={() => setPage((page) => Math.max(1, page - 1))}
//               disabled={page === 1}
//               className={`px-3 py-1 rounded-l focus:outline-none ${
//                 page === 1 ? "bg-gray-300" : "bg-gray-200"
//               }`}
//             >
//               <FaArrowLeft
//                 className={`text-black ${
//                   page === 1 ? "text-gray-400" : "text-black"
//                 } inline`}
//               />
//               <span className="sr-only">Previous Page</span>
//             </button>

//             {renderPageNumbers()}
//             <button
//               onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
//               disabled={page === totalPages}
//               className={`px-3 py-1 rounded-r focus:outline-none ${
//                 page === totalPages ? "bg-gray-300" : "bg-gray-200"
//               }`}
//             >
//               <FaArrowRight
//                 className={`text-black ${
//                   page === totalPages ? "text-gray-400" : "text-black"
//                 } inline`}
//               />
//               <span className="sr-only">Next Page</span>
//             </button>
//           </div>
//         </div>
//         {showCreateForm && (
//           <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-md w-1/2">
//               <h2 className="text-xl font-bold mb-4">Create New Employee</h2>
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   submitEmployee(newEmployeeData);
//                 }}
//               >
//                 <div className="grid grid-cols-2 gap-4">
//                   <input
//                     type="text"
//                     placeholder="Name"
//                     value={newEmployeeData.username}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         username: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Email"
//                     value={newEmployeeData.Email}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         Email: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="password"
//                     placeholder="password"
//                     value={newEmployeeData.password}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         password: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Gender"
//                     value={newEmployeeData.Gender}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         Gender: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="DOB"
//                     value={newEmployeeData.dOB}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         dOB: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Role"
//                     value={newEmployeeData.Role}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         Role: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Employee ID"
//                     value={newEmployeeData.EmployeeId}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         EmployeeId: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Position"
//                     value={newEmployeeData.Position}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         Position: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Department"
//                     value={newEmployeeData.Department}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         Department: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="NRC"
//                     value={newEmployeeData.NRC}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         NRC: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Phone Number"
//                     value={newEmployeeData.PhoneNumber}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         PhoneNumber: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Salary"
//                     value={newEmployeeData.Salary}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         Salary: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Annual Leave"
//                     value={newEmployeeData.AnnualLeave}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         AnnualLeave: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Medical Leave"
//                     value={newEmployeeData.MedicalLeave}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         MedicalLeave: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                   <input
//                     type="text"
//                     placeholder="Attendance Leave"
//                     value={newEmployeeData.AttendanceLeave}
//                     onChange={(e) =>
//                       setNewEmployeeData({
//                         ...newEmployeeData,
//                         AttendanceLeave: e.target.value,
//                       })
//                     }
//                     className="p-2 border border-gray-300 rounded text-black"
//                   />
//                 </div>
//                 <div className="mt-4 flex justify-end gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setShowCreateForm(false)}
//                     className="bg-gray-500 text-white px-4 py-2 rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="bg-blue-500 text-white px-4 py-2 rounded"
//                   >
//                     Create
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default Employee;

/* <div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-4">Employee List</h1>
            </div>
          </div>

          <div className="flex items-center justify-end mb-4 gap-2">
            <button
              className=" text-sm  font-medium p-2 hover:bg-gray-100 rounded-md text-black bg-white"
              onClick={handleCreate}
            >
              Create
            </button>

            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="text-black rounded-md"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by id"
                value={idFilter}
                onChange={(e) => setIdFilter(e.target.value)}
                className="text-black rounded-md"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-black rounded-sm"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="text-black rounded-sm"
            >
              <option value="">All Positions</option>

              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <table
            className="min-w-full divide-y text-black"
            {...getTableProps()}
            style={{ border: "solid 1px black" }}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      style={{
                        borderBottom: "solid 3px black",
                        background: "aliceblue",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: "10px",
                            border: "solid 1px gray",
                            background: "#E1FF3C",
                          }}
                        >
                          {editingRow === row.original.id ? (
                            <input
                              ref={inputRefs.current[rowIndex]}
                              name={cell.column.id}
                              value={formData[cell.column.id] || ""}
                              onChange={handleChange}
                              className="w-full p-1"
                            />
                          ) : (
                            cell.render("Cell")
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination fixed bottom-4 right-4 flex items-center">
            <span className="px-2 ">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <button
              onClick={() => setPage((page) => Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-l focus:outline-none ${
                page === 1 ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              <FaArrowLeft
                className={`text-black ${
                  page === 1 ? "text-gray-400" : "text-black"
                } inline`}
              />
              <span className="sr-only">Previous Page</span>
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-r focus:outline-none ${
                page === totalPages ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              <FaArrowRight
                className={`text-black ${
                  page === totalPages ? "text-gray-400" : "text-black"
                } inline`}
              />
              <span className="sr-only">Next Page</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Employee; */

import React, { useEffect, useState } from "react";
import { useTable, usePagination } from "react-table";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaPlus,
} from "react-icons/fa";

import { motion } from "framer-motion";
import { axiosInstance } from "./axios";

const Employee = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [idFilter, setIdFilter] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [editingRow, setEditingRow] = useState(null);

  const [formData, setFormData] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    username: "",
    Email: "",
    password: "",
    Gender: "",
    dOB: "",
    Role: "",
    EmployeeId: "",
    Position: "",
    Department: "",
    NRC: "",
    PhoneNumber: "",
    Salary: "",
    AnnualLeave: "",
    MedicalLeave: "",
    AttendanceLeave: "",
  });

  useEffect(() => {
    fetchEmployeeData();
  }, [page, pageSize, nameFilter, selectedDept, selectedPosition, idFilter]);

  const fetchEmployeeData = async () => {
    try {
      const response = await axiosInstance.get("/users", {
        params: {
          username: nameFilter,
          employeeId: idFilter,
          department: selectedDept,
          position: selectedPosition,
          page: page - 1,
          size: pageSize,
        },
      });
      setData(response.data.datas);
      setLoading(false);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setLoading(false);
    }
  };

  const submitEmployee = async (newData) => {
    try {
      const response = await axiosInstance.post("/users/createUser", newData);
      console.log(response.data.datas);
      console.log(newData);
      fetchEmployeeData();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };
  const handleEdit = (row) => {
    setEditingRow(row.original.id);
    setFormData({ ...row.original });
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Department") {
      setFormData({
        ...formData,
        Department: {
          ...formData.Department,
          DeptName: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    console.log(formData);
    try {
      const {
        id,
        DepartmentId,
        username,
        EmployeeId,
        Position,
        Department,
        NRC,
        PhoneNumber,
        Salary,
        AnnualLeave,
        MedicalLeave,
        AttendanceLeave,
      } = formData;
      if (!id) {
        console.error("Employee ID is missing.");
        return;
      }
      const updatedDataPayload = {
        username: username,
        position: Position,
        employeeId: EmployeeId,
        phoneNumber: PhoneNumber,
        salary: parseInt(Salary),
        departmentName: Department?.DeptName,
        nrc: NRC,
        annualLeave: parseInt(AnnualLeave),
        medicalLeave: parseFloat(MedicalLeave),
        attendanceLeave: parseInt(AttendanceLeave),
        departmentId: parseInt(DepartmentId),
      };

      const endpoint = `/users/update/${id}`;
      await axiosInstance.put(endpoint, updatedDataPayload);
      fetchEmployeeData();
      setEditingRow(null);
    } catch (error) {
      console.error("Error updating employee data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const endpoint = `/users/deleteUser/${id}`;
      await axiosInstance.delete(endpoint);
      fetchEmployeeData();
    } catch (error) {
      console.error("Error deleting employee data:", error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "No.",
        accessor: (row, i) => (page - 1) * pageSize + i + 1,
      },
      {
        Header: "Name",
        accessor: "username",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="username"
              value={formData.username || ""}
              className="w-full p-1"
            />
          ) : (
            row.original.username
          ),
      },
      {
        Header: "Employee ID",
        accessor: "EmployeeId",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="EmployeeId"
              value={formData.EmployeeId || ""}
              onChange={handleChange}
              className="w-full p-1"
            />
          ) : (
            row.original.EmployeeId
          ),
      },
      {
        Header: "Position",
        accessor: "Position",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="Position"
              value={formData.Position || ""}
              onChange={handleChange}
              className="w-full p-1"
            />
          ) : (
            row.original.Position
          ),
      },
      {
        Header: "Department",
        accessor: "Department.DeptName",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="Department"
              value={formData.Department?.DeptName || ""}
              onChange={handleChange}
              className="w-full p-1"
            />
          ) : (
            row.original.Department?.DeptName
          ),
      },
      {
        Header: "NRC",
        accessor: "NRC",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="NRC"
              value={formData.NRC || ""}
              onChange={handleChange}
              className="w-full p-1"
            />
          ) : (
            row.original.NRC
          ),
      },
      {
        Header: "Ph-No",
        accessor: "PhoneNumber",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="PhoneNumber"
              value={formData.PhoneNumber || ""}
              onChange={handleChange}
              className="w-full p-1"
            />
          ) : (
            row.original.PhoneNumber
          ),
      },
      {
        Header: "Salary",
        accessor: "Salary",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="Salary"
              value={formData.Salary || ""}
              onChange={handleChange}
              className="w-full p-1"
            />
          ) : (
            row.original.Salary
          ),
      },
      {
        Header: "Annual Leave",
        accessor: "AnnualLeave",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="AnnualLeave"
              value={formData.AnnualLeave || ""}
              onChange={handleChange}
              className="w-full p-1"
            />
          ) : (
            row.original.AnnualLeave
          ),
      },
      {
        Header: "Medical Leave",
        accessor: "MedicalLeave",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="MedicalLeave"
              value={formData.MedicalLeave || ""}
              onChange={handleChange}
              className="w-full p-1"
            />
          ) : (
            row.original.MedicalLeave
          ),
      },
      {
        Header: "Attendance Leave",
        accessor: "AttendanceLeave",
        Cell: ({ row }) =>
          editingRow === row.original.id ? (
            <input
              autoFocus
              name="AttendanceLeave"
              value={formData.AttendanceLeave || ""}
              onChange={handleChange}
              className="w-full p-1"
            />
          ) : (
            row.original.AttendanceLeave
          ),
      },
      {
        Header: "Action",
        id: "actions",
        accessor: "id",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            {editingRow === row.original.id ? (
              <>
                <FaCheck
                  className="text-green-500 cursor-pointer"
                  onClick={handleSave}
                />
                <FaTimes
                  className="text-red-500 cursor-pointer"
                  onClick={handleCancelEdit}
                />
              </>
            ) : (
              <>
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleEdit(row)}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(row.original.id)}
                />
              </>
            )}
          </div>
        ),
      },
    ],
    [editingRow, formData, page, pageSize]
  );
  console.log("editigRow:", editingRow);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,

    pageOptions,

    state: { pageIndex },
    gotoPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: page - 1, pageSize },
      manualPagination: true,
      pageCount: totalPages,
    },
    usePagination
  );

  useEffect(() => {
    gotoPage(page - 1);
  }, [page, gotoPage]);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 rounded ${
              page === i ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            {i}
          </button>
        );
      } else if (
        (i === page - 2 && page > 3) ||
        (i === page + 2 && page < totalPages - 2)
      ) {
        pageNumbers.push(
          <button key={i} className="px-3 py-1 bg-white text-black rounded">
            ...
          </button>
        );
      }
    }
    return pageNumbers;
  };

  const departments = [
    ...new Set(data.map((employee) => employee.Department?.DeptName)),
  ];
  const positions = [...new Set(data.map((employee) => employee.Position))];

  return (
    <main className="main-container">
      <div className="container mx-auto">
        {loading && (
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0, loop: Infinity }}
            className="my-6 flex items-center "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="animate-spin h-6 w-6 mr-2"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 4.418 3.582 8 8 8v-4c-2.061 0-3.931-.784-5.344-2.069l1.729-1.73zm4.281-4.283L4 14h8c0-4.418-3.582-8-8-8v4c1.172 0 2.26.308 3.219.84z"
              ></path>
            </svg>
            Loading...
          </motion.div>
        )}

        <div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold mr-4">Employee List</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-500 text-white px-3 py-2 rounded"
              >
                <FaPlus className="inline mr-2" />
                Create
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end mb-4 gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="text-black rounded-md"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by id"
                value={idFilter}
                onChange={(e) => setIdFilter(e.target.value)}
                className="text-black rounded-md"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-black rounded-sm"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="text-black rounded-sm"
            >
              <option value="">All Positions</option>

              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          <table
            className="min-w-full divide-y text-black"
            {...getTableProps()}
            style={{ border: "solid 1px black" }}
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      {...column.getHeaderProps()}
                      style={{
                        borderBottom: "solid 3px black",
                        background: "aliceblue",
                        color: "black",
                        fontWeight: "bold",
                      }}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          style={{
                            padding: "10px",
                            border: "solid 1px gray",
                            background: "#E1FF3C",
                          }}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination fixed bottom-4 right-4 flex items-center">
            <span className="px-2 ">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>
            <button
              onClick={() => setPage((page) => Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded-l focus:outline-none ${
                page === 1 ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              <FaArrowLeft
                className={`text-black ${
                  page === 1 ? "text-gray-400" : "text-black"
                } inline`}
              />
              <span className="sr-only">Previous Page</span>
            </button>

            {renderPageNumbers()}
            <button
              onClick={() => setPage((page) => Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-r focus:outline-none ${
                page === totalPages ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              <FaArrowRight
                className={`text-black ${
                  page === totalPages ? "text-gray-400" : "text-black"
                } inline`}
              />
              <span className="sr-only">Next Page</span>
            </button>
          </div>
        </div>
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md w-1/2">
              <h2 className="text-xl font-bold mb-4">Create New Employee</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitEmployee(newEmployeeData);
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newEmployeeData.username}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        username: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    value={newEmployeeData.Email}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        Email: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="password"
                    placeholder="password"
                    value={newEmployeeData.password}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        password: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Gender"
                    value={newEmployeeData.Gender}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        Gender: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="DOB"
                    value={newEmployeeData.dOB}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        dOB: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={newEmployeeData.Role}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        Role: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Employee ID"
                    value={newEmployeeData.EmployeeId}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        EmployeeId: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={newEmployeeData.Position}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        Position: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={newEmployeeData.Department}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        Department: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="NRC"
                    value={newEmployeeData.NRC}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        NRC: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newEmployeeData.PhoneNumber}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        PhoneNumber: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Salary"
                    value={newEmployeeData.Salary}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        Salary: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Annual Leave"
                    value={newEmployeeData.AnnualLeave}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        AnnualLeave: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Medical Leave"
                    value={newEmployeeData.MedicalLeave}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        MedicalLeave: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Attendance Leave"
                    value={newEmployeeData.AttendanceLeave}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        AttendanceLeave: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Employee;
