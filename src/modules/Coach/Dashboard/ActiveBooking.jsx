import React, { useEffect, useState } from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { Input } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import BookingChart from "./BookingChart"; 

// const data = [
//   {
//     session: "Session 1",
//     startDate: "2024-01-01",
//     endDate: "2024-01-02",
//     amount: "$100",
//     address: "123 Yoga St, Wellness City",
//   },
//   {
//     session: "Session 2",
//     startDate: "2024-01-03",
//     endDate: "2024-01-04",
//     amount: "$200",
//     address: "456 Pilates Ave, Fitness Town",
//   },
//   {
//     session: "Session 3",
//     startDate: "2024-01-05",
//     endDate: "2024-01-06",
//     amount: "$300",
//     address: "789 Meditation Blvd, Zen City",
//   },
//   {
//     session: "Session 4",
//     startDate: "2024-06-01",
//     endDate: "2024-06-02",
//     amount: "$150",
//     address: "101 Cardio St, Exercise City",
//   },
//   {
//     session: "Session 5",
//     startDate: "2024-06-03",
//     endDate: "2024-06-04",
//     amount: "$250",
//     address: "102 Strength Blvd, Muscle Town",
//   },
// ];

const columns = [
  { Header: "Session", accessor: "session" },
  { Header: "Start Date", accessor: "startDate" },
  { Header: "End Date", accessor: "endDate" },
  { Header: "Amount", accessor: "amount" },
  { Header: "Session Status", accessor: "sessionStatus" },
  { Header: "Address", accessor: "address" },
];

export function ActiveBooking() {
  const [filterInput, setFilterInput] = useState("");
  const [loading , setLoading] = useState(false)
 

  const tableInstance = useTable({ columns, data }, useGlobalFilter, useSortBy, usePagination);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, setGlobalFilter, page, state } = tableInstance;

  const { pageIndex, pageSize } = state;

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setGlobalFilter(value);
    setFilterInput(value);
  };

  const currentAndUpcomingBookings = data.filter((booking) => new Date(booking.endDate) >= new Date());


  useEffect(() => {
   
  }, [currentUser])
  

  return (
    <div className="p-4  ">
      {/* <BookingChart data={currentAndUpcomingBookings} /> */}
      <p className="text-[25px] font-semibold py-6">Active Bookings</p>
      <div className="flex justify-between mb-4">
        <div className="flex items-center rounded-md px-3">
          <Input value={filterInput} onChange={handleFilterChange} label="Search" icon={<IoIosSearch />} />
        </div>

        <Link to={"?tab=bookings"} className="flex items-center px-4 py-1 bg-main-dark hover:bg-main-accent rounded-md duration-200">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full bg-white border rounded-lg mt-4 overflow-x-auto">
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
      </div>
    </div>
  );
}

export default ActiveBooking;
