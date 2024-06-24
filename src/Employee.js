import React, { useContext, useEffect, useState } from "react";
import { useTable, usePagination } from "react-table";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { axiosInstance } from "./axios";
import { UserContext } from "./UserContext";
import Modal from "react-modal";
import { departmentList, positionList, userRoleList } from "./data";

Modal.setAppElement("#root");

const Employee = () => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [nameFilter, setNameFilter] = useState("");
  const [idFilter, setIdFilter] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [newEmployeeData, setNewEmployeeData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    role: "",
    employeeId: "",
    position: "",
    departmentName: "",
    nrc: "",
    phoneNumber: "",
    salary: "",
    annualLeave: "",
    medicalLeave: "",
    attendanceLeave: "",
    address: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [hasFormError, setHasFormError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateData = () => {
    // check empty
    const isEmpty = Object.entries(newEmployeeData).reduce(
      (acc, [key, value]) => {
        if (isEdit && key === "password") acc = true;
        else acc = !value;
        return acc;
      },
      false
    );

    if (isEmpty) {
      setFormError("Please fill all input");
      setHasFormError(true);

      setTimeout(() => {
        setHasFormError(false);
      }, 3000);
      return false;
    }

    // check email validatation

    if (!/^[^@]+@[^@]+\.[^@]+$/.test(newEmployeeData.email)) {
      setFormError("Invalid email format");
      setHasFormError(true);
      setTimeout(() => {
        setHasFormError(false);
      }, 3000);
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (user) {
      fetchEmployeeData();
    }
  }, [page, pageSize, nameFilter, selectedDept, selectedPosition, idFilter]);

  useEffect(() => {
    if (user.role === 3000) {
      setSelectedDept(user.department);
    }
  }, [user]);

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
    if (!validateData()) return;

    try {
      const response = await axiosInstance.post("/users/createUser", newData);
      fetchEmployeeData();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };
  const handleEdit = (row) => {
    setNewEmployeeData({
      id: row.original.id,
      // disabled
      gender: row.original.Gender,
      role: row.original.Role,
      dob: row.original.DOB,
      address: row.original.Address,
      // can edit
      username: row.original.username,
      position: row.original.Position,
      employeeId: row.original.EmployeeId,
      phoneNumber: row.original.PhoneNumber,
      salary: row.original.Salary,
      departmentId: row.original.DepartmentId,
      departmentName: row.original.Department.DeptName,
      nrc: row.original.NRC,
      annualLeave: row.original.AnnualLeave,
      medicalLeave: row.original.MedicalLeave,
      attendanceLeave: row.original.AttendanceLeave,
      password: "",
      email: row.original.Email,
    });
    setIsEdit(true);
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setNewEmployeeData({});
    setIsEdit(false);
    setShowCreateForm(false);
  };

  const handleSave = async () => {
    if (!validateData()) return;
    try {
      const {
        id,
        username,
        position,
        employeeId,
        phoneNumber,
        salary,
        departmentId,
        departmentName,
        nrc,
        annualLeave,
        medicalLeave,
        attendanceLeave,
        email,
        gender,
        role,
        dob,
        address,
      } = newEmployeeData;
      if (!id) {
        console.error("Employee ID is missing.");
        return;
      }
      const updatedDataPayload = {
        username,
        position,
        employeeId,
        phoneNumber,
        salary: parseInt(salary),
        departmentName,
        nrc,
        annualLeave: parseInt(annualLeave),
        medicalLeave: parseFloat(medicalLeave),
        attendanceLeave: parseInt(attendanceLeave),
        departmentId: parseInt(departmentId),
        email,
        gender,
        role,
        dob,
        address,
      };

      const endpoint = `/users/update/${id}`;
      await axiosInstance.put(endpoint, updatedDataPayload);
      setShowCreateForm(false);
      setIsEdit(false);
      setNewEmployeeData({});

      fetchEmployeeData();
    } catch (error) {
      console.error("Error updating employee data:", error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
  };
  const cancelDelete = () => {
    setDeleteId(null);
  };

  const handleDelete = async () => {
    try {
      const endpoint = `/users/deleteUser/${deleteId}`;
      await axiosInstance.delete(endpoint);
      fetchEmployeeData();
      cancelDelete();
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
        Cell: ({ row }) => row.original.username,
      },
      {
        Header: "Employee ID",
        accessor: "EmployeeId",
        Cell: ({ row }) => row.original.EmployeeId,
      },
      {
        Header: "Position",
        accessor: "Position",
        Cell: ({ row }) => row.original.Position,
      },
      {
        Header: "Department",
        accessor: "Department.DeptName",
        Cell: ({ row }) => row.original.Department?.DeptName,
      },
      {
        Header: "NRC",
        accessor: "NRC",
        Cell: ({ row }) => row.original.NRC,
      },
      {
        Header: "Ph-No",
        accessor: "PhoneNumber",
        Cell: ({ row }) => row.original.PhoneNumber,
      },
      {
        Header: "Salary",
        accessor: "Salary",
        Cell: ({ row }) => row.original.Salary,
      },
      {
        Header: "Annual Leave",
        accessor: "AnnualLeave",
        Cell: ({ row }) => row.original.AnnualLeave,
      },
      {
        Header: "Medical Leave",
        accessor: "MedicalLeave",
        Cell: ({ row }) => row.original.MedicalLeave,
      },
      {
        Header: "Attendance Leave",
        accessor: "AttendanceLeave",
        Cell: ({ row }) => row.original.AttendanceLeave,
      },
      {
        Header: "Action",
        id: "actions",
        accessor: "id",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            {user.role === 5000 && (
              <>
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleEdit(row)}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => confirmDelete(row.original.id)}
                />
              </>
            )}
          </div>
        ),
      },
    ],
    [page, pageSize]
  );
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

  useEffect(() => {
    axiosInstance
      .get("/departments/")
      .then((response) => {
        setDepartments(response?.data?.data || []);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
              {user.role === 5000 && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                >
                  <FaPlus className="inline mr-2" />
                  Create
                </button>
              )}
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

            <div className="relative">
              <input
                type="text"
                placeholder="Search by position"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="text-black rounded-md"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {/* <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="text-black rounded-sm"
            >
              <option value="">All Position</option>
              {departments.map((pos) => (
                <option key={pos.position} value={pos.position}>
                  {pos.position}
                </option>
              ))}
            </select> */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-black rounded-sm"
              disabled={user.role === 3000}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.deptName} value={dept.deptName}>
                  {dept.deptName}
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
              {rows.map((row, index) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, index) => {
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
              <h2 className="text-xl font-bold mb-4 text-black">
                {isEdit ? "Edit" : "Create New"} Employee
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    required
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
                    type="email"
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    placeholder="Email"
                    required
                    value={newEmployeeData.email}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        email: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required={!isEdit}
                      value={newEmployeeData.password}
                      onChange={(e) =>
                        setNewEmployeeData({
                          ...newEmployeeData,
                          password: e.target.value,
                        })
                      }
                      className="p-2 border border-gray-300 rounded text-black w-full pr-8"
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

                  <select
                    required
                    value={newEmployeeData.gender}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        gender: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  >
                    <option value="" disabled selected>
                      Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>

                  <input
                    type="date"
                    placeholder="DOB"
                    required
                    value={newEmployeeData.dob}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        dob: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <select
                    required
                    value={newEmployeeData.role}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        role: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  >
                    <option value="" disabled selected>
                      Role
                    </option>
                    {userRoleList.map((role) => (
                      <option value={role.value} key={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Employee ID"
                    required
                    value={newEmployeeData.employeeId}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        employeeId: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <select
                    required
                    value={newEmployeeData.position}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        position: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  >
                    <option value="" disabled selected>
                      Position
                    </option>
                    {positionList.map((position) => (
                      <option value={position} key={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                  <select
                    required
                    value={newEmployeeData.departmentName}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        departmentName: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  >
                    <option value="" disabled selected>
                      Department
                    </option>
                    {departmentList.map((department) => (
                      <option value={department} key={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="NRC"
                    required
                    value={newEmployeeData.nrc}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        nrc: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text" // can include 09, if number, can't start with 0
                    placeholder="Phone Number"
                    required
                    value={newEmployeeData.phoneNumber}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    required
                    value={newEmployeeData.address}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        address: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="number"
                    placeholder="Salary"
                    required
                    value={newEmployeeData.salary}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        salary: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="number"
                    placeholder="Annual Leave"
                    required
                    value={newEmployeeData.annualLeave}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        annualLeave: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="number"
                    placeholder="Medical Leave"
                    required
                    value={newEmployeeData.medicalLeave}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        medicalLeave: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                  <input
                    type="number"
                    placeholder="Attendance Leave"
                    required
                    value={newEmployeeData.attendanceLeave}
                    onChange={(e) =>
                      setNewEmployeeData({
                        ...newEmployeeData,
                        attendanceLeave: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded text-black"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={() =>
                      isEdit ? handleSave() : submitEmployee(newEmployeeData)
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {isEdit ? "Save" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteId !== null}
        className="flex justify-center items-center min-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="bg-white p-8 rounded-md shadow-lg text-center">
          <h2 className="text-2xl mb-4">Are you sure to delete?</h2>

          <div className="d-flex justify-between">
            <button
              className="mx-2 px-2 py-1 border border-gray-300 rounded text-black"
              onClick={cancelDelete}
            >
              Cancel
            </button>
            <button
              className="mx-2 px-2 py-1 border border-gray-300 rounded text-white bg-red-800"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={hasFormError}
        onRequestClose={() => setHasFormError(false)}
        contentLabel="Status"
        className="flex justify-center items-center min-h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <div className="bg-white p-8 rounded-md shadow-lg text-center">
          <h2 className="text-2xl mb-4">{formError}</h2>
        </div>
      </Modal>
    </main>
  );
};

export default Employee;
