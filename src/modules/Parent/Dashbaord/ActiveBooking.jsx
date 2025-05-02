import React, { useEffect, useState } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { CSVLink } from "react-csv";
import { FaSearch, FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight, FaDownload, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { MdMoreVert } from "react-icons/md";
import { Menu, MenuHandler, MenuList, MenuItem, Input } from "@material-tailwind/react";
import { useSelector } from "react-redux";

const columns = [
  { Header: "No.", accessor: "no", Cell: ({ row }) => row.index + 1 },
  { Header: "Session", accessor: "sessionName" },
  { Header: "Start Date", accessor: "startDate" },
  { Header: "End Date", accessor: "endDate" },
  { Header: "Amount", accessor: "price" },
];

export function ActiveBooking() {
  const [filterInput, setFilterInput] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [fetchDetails, setFetchDetails] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getSessionDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/bookedsession/getdata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filteredData = data.filter((item) => item.playerId === currentUser._id);
          setFetchDetails(filteredData);
        } else {
          console.error("Failed to fetch session details. Status:", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSessionDetails();
  }, [currentUser]);

  const tableInstance = useTable({ columns, data: fetchDetails }, useGlobalFilter, useSortBy, usePagination);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = tableInstance;

  const { pageIndex, pageSize } = state;

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setGlobalFilter(value);
    setFilterInput(value);
  };

  const handleDownloadCsv = () => {
    const formattedData = fetchDetails.map((row) => ({
      Session: row.session,
      "Start Date": row.startDate,
      "End Date": row.endDate,
      Amount: row.amount,
    }));
    setCsvData(formattedData);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <p className="text-[25px] font-semibold py-6">Active Bookings</p>
      <div className="flex justify-between mb-4">
        <div className="flex items-center rounded-md px-3">
          <Input value={filterInput} onChange={handleFilterChange} label="Search" icon={<IoIosSearch />} />
        </div>
        <button onClick={handleDownloadCsv} className="flex items-center px-4 py-1 bg-main-dark hover:bg-main-accent  rounded-md  duration-200">
          <FaDownload className="mr-2" />
          <CSVLink data={csvData} filename={"data.csv"} className="text-black">
            Download CSV
          </CSVLink>
        </button>
      </div>
      <table {...getTableProps()} className="min-w-full bg-white border rounded-lg">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="border-b">
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-2 text-left">
                  <div className="flex items-center">
                    {column.render("Header")}
                    <span className="ml-2">{column.isSorted ? column.isSortedDesc ? <FaSortDown /> : <FaSortUp /> : <FaSort />}</span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length > 0 ? (
            page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="border-b">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-4 py-2">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No results found 🙁
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="px-2 py-1 border rounded-md mr-2 bg-main-accent">
            <FaAngleDoubleLeft />
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-2 py-1 border rounded-md mr-2 bg-main-primary">
            <FaAngleLeft />
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="px-2 py-1 border rounded-md mr-2 bg-main-primary">
            <FaAngleRight />
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="px-2 py-1 border rounded-md mr-2 bg-main-accent">
            <FaAngleDoubleRight />
          </button>
        </div>
        <span className="px-4">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="px-2 py-1 border rounded-md">
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ActiveBooking;
