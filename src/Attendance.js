import React, { useContext, useEffect, useState } from "react";
import { useTable, usePagination } from "react-table";
import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { axiosInstance } from "./axios";
import { UserContext } from "./UserContext";

const Attendance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);
  const [nameFilter, setNameFilter] = useState("");
  const [startDate, endDate] = dateRange;
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");

  const { user } = useContext(UserContext);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchAttendanceData();
  }, [
    page,
    pageSize,
    startDate,
    endDate,
    nameFilter,
    selectedDept,
    selectedPosition,
  ]);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/attendance", {
        params: {
          fromDate: startDate
            ? startDate.toISOString().split("T")[0]
            : undefined,
          toDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
          username: nameFilter,
          department: selectedDept,
          position: selectedPosition,
          page: page - 1, // the backend pagination is zero-indexed
          size: pageSize,
        },
      });
      setData(response.data.datas);
      setTotalPages(response.data.totalPage);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
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
      },
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Position",
        accessor: "position",
      },
      {
        Header: "Department",
        accessor: "departmentName",
      },
      {
        Header: "In Time",
        accessor: "in_time",
      },
      {
        Header: "Out Time",
        accessor: "out_time",
      },
    ],
    [page, pageSize]
  );

  const location = useLocation();

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

  useEffect(() => {
    if (user.role === 3000) {
      setSelectedDept(user.department);
    }
  }, [user]);

  return (
    <main className="main-container">
      <div className="container mx-auto">
        {loading && (
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0, loop: Infinity }}
            className="my-6 flex items-center"
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
              <h1 className="text-2xl font-bold mr-4">Attendance</h1>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              <div>
                <Link
                  to="/attendance"
                  className={`nav-link ${
                    location.pathname === "/attendance"
                      ? "border-b-2 border-[#E1FF3C]"
                      : ""
                  }`}
                >
                  List
                </Link>
              </div>
              <div className="ml-4">
                <Link
                  to="/request"
                  className={`nav-link ${
                    location.pathname === "/request"
                      ? "border-b-2 border-[#E1FF3C]"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) =>
                    e.target.classList.add("border-b-2", "border-[#E1FF3C]")
                  }
                  onMouseLeave={(e) =>
                    e.target.classList.remove("border-b-2", "border-[#E1FF3C]")
                  }
                >
                  Request
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mb-4 gap-1">
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
            <DatePicker
              selected={startDate}
              onChange={(update) => setDateRange(update)}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              isClearable={true}
              placeholderText="Select date range"
              className="text-black rounded-md"
            />

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

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-black rounded-sm"
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
            className="min-w-full divide-y  text-black"
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
                {/* {page} of {totalPages} */}
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

export default Attendance;
