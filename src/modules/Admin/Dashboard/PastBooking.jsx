import { Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
  FaDownload,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { getBookings, releasePayment } from "../../../services/AdminApis";
import { ClipLoader } from "react-spinners";

const columns = [
  { Header: "Session Id", accessor: "_id" },
  { Header: "Session Type", accessor: "sessionType" },
  { Header: "Date", accessor: "sessionDate" },
  { Header: "Start Time", accessor: "startTime" },
  { Header: "End Time", accessor: "endTime" },
  { Header: "Amount", accessor: "sessionAmount" },
  { Header: "Session status", accessor: "sessionStatus" },
  { Header: "Payment status", accessor: "paymentStatus" },
  { Header: "Postal Code", accessor: "postalCode" },
  { Header: "Player", accessor: "playerId.username" },
];

export function PastBookings({}) {
  const [filterInput, setFilterInput] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSessionDetails = async () => {
      try {
        setLoading(true);
        const dataToSend = {
          status: "confirmed",
          sessionStatus: "completed",
          paymentStatus: "completed",
        };
        const response = await getBookings(dataToSend);
        setBookings(response);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getSessionDetails();
  }, []);

  useEffect(() => {
    const formattedData = bookings.map((row) => ({
      sessionType: row.sessionType,
      sessionDate: new Date(row.sessionDate).toLocaleDateString(),
      startTime: row.startTime,
      endTime: row.endTime,
      sessionAmount: `$${row.sessionAmount.toFixed(2)}`,
      postalCode: row.postalCode,
      playerName: row.playerId ? row.playerId.username : "N/A",
    }));
    setCsvData(formattedData);
  }, [bookings]);

  const tableInstance = useTable(
    { columns, data: bookings },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

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

  if (loading)
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />;
      </div>
    );

  return (
    <div className="p-4">
      <p className="text-[25px] font-semibold py-6">Past Bookings</p>
      <div className="flex justify-between mb-4">
        <div className="flex items-center rounded-md px-3">
          <Input
            value={filterInput}
            onChange={handleFilterChange}
            label="Search"
            icon={<IoIosSearch />}
          />
        </div>
        <button className="flex items-center px-4 py-1 bg-main-dark hover:bg-main-accent rounded-md duration-200">
          <FaDownload className="mr-2" />
          <CSVLink
            data={csvData}
            filename={"bookings.csv"}
            className="text-black"
          >
            Download CSV
          </CSVLink>
        </button>
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: "500px" }}>
        <table
          {...getTableProps()}
          className="min-w-full bg-white border rounded-lg"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="border-b">
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-2 text-left"
                  >
                    <div className="flex items-center">
                      {column.render("Header")}
                      <span className="ml-2">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaSortDown />
                          ) : (
                            <FaSortUp />
                          )
                        ) : (
                          <FaSort />
                        )}
                      </span>
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
      </div>
      <div className="pagination mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="p-2 border mr-2 bg-main-accent rounded-full"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="p-1.5 border rounded-full mr-2 bg-main-primary"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="p-1.5 border rounded-full mr-2 bg-main-primary"
          >
            <FaAngleRight />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="p-2 border mr-2 bg-main-accent rounded-full"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
        <span className="px-4">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-2"
        >
          {[10, 20, 30, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
