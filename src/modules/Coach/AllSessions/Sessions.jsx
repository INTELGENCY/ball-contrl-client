import { Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { getBookings } from "../../../services/CoachApi";
import { ClipLoader } from "react-spinners";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";

export function PastBookings({ user }) {
  const [filterInput, setFilterInput] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const getSessionDetails = async () => {
      try {
        setLoading(true);
        const dataToSend = {
          coachId: user._id,
          // status: "confirmed",
          sessionStatus: ["completed", "canceled"],
          // status: ["completed", "canceled"],
          paymentStatus: ["completed", "canceled", "refunded"],
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
  }, [user]);

  useEffect(() => {
    const formattedData = bookings?.map((row) => ({
      sessionType: row.sessionType,
      sessionDate: moment(row.sessionDate).format("YYYY-MM-DD"),
      startTime: row.startTime,
      endTime: row.endTime,
      sessionAmount: `£${row?.sessionAmount.toFixed(2)}`,
      postalCode: row?.postalCode,
      sessionStatus: row?.sessionStatus,
      paymentStatus: row?.paymentStatus,
      playerName: row.playerId ? row?.playerId?.username : "N/A",
    }));
    setCsvData(formattedData);
  }, [bookings]);

  const columns = [
    { field: "sessionType", headerName: "Session Type", width: 200 },
    { field: "sessionDate", headerName: "Date", width: 150 },
    { field: "startTime", headerName: "Start Time", width: 150 },
    { field: "endTime", headerName: "End Time", width: 150 },
    { field: "sessionAmount", headerName: "Amount", width: 150 },
    {
      field: "sessionStatus",
      headerName: "Session Status",
      width: 150,
      renderCell: (params) => {
        let statusColor;
        switch (params.value) {
          case "not started":
            statusColor = "bg-gray-400";
            break;
          case "ongoing":
            statusColor = "bg-blue-500";
            break;
          case "completed":
            statusColor = "bg-green-500";
            break;
          case "canceled":
            statusColor = "bg-red-500";
            break;
          default:
            statusColor = "bg-gray-400";
        }
        return (
          <span
            className={`px-2 py-1 rounded-full text-white text-xs ${statusColor}`}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 150,
      renderCell: (params) => {
        let statusColor;
        switch (params.value) {
          case "requires capture":
            statusColor = "bg-yellow-800";
            break;
          case "completed":
            statusColor = "bg-green-500";
            break;
          case "canceled":
            statusColor = "bg-red-500";
            break;
          default:
            statusColor = "bg-gray-400";
        }
        return (
          <span
            className={`px-2 py-1 rounded-full text-white text-xs ${statusColor}`}
          >
            {params.value}
          </span>
        );
      },
    },
    { field: "postalCode", headerName: "Postal Code", width: 150 },
    {
      field: "playerName",
      headerName: "Player",
      width: 150,
    },
  ];

  const filteredBookings = bookings
    .filter((row) => {
      const searchTerm = filterInput.toLowerCase();
      return (
        row.sessionType?.toLowerCase().includes(searchTerm) ||
        row.playerId?.username?.toLowerCase().includes(searchTerm) ||
        row.postalCode?.toLowerCase().includes(searchTerm)
      );
    })
    .map((row, index) => ({
      id: index + 1,
      ...row,
      sessionDate: moment(row.sessionDate).format("YYYY-MM-DD"),
      sessionAmount: `$${row.sessionAmount.toFixed(2)}`,
      playerName: row.playerId?.username || "N/A",
    }));

  if (loading)
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />
      </div>
    );

  return (
    <div className="p-4">
      <p className="text-[25px] font-semibold py-6">Past Bookings</p>

      <div className="flex justify-between mb-4">
        <div className="flex items-center rounded-md px-3">
          <Input
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            label="Search"
            icon={<IoIosSearch />}
          />
        </div>

        <button className="flex items-center px-4 py-1 bg-main-dark hover:bg-main-accent rounded-md duration-200">
          <FaDownload className="mr-2" />
          <CSVLink
            data={csvData}
            filename={"past_bookings.csv"}
            className="text-black"
          >
            Download CSV
          </CSVLink>
        </button>
      </div>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredBookings}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 30, 50]}
          pagination
          disableRowSelectionOnClick
          getRowId={(row) => row._id || row.id}
        />
      </div>
    </div>
  );
}
