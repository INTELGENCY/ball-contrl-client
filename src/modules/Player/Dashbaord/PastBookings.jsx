import React, { useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";
import { DataGrid } from "@mui/x-data-grid";
import { CSVLink } from "react-csv";
import { IoIosSearch } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import { getBookings } from "../../../services/PlayerApis";
import { ClipLoader } from "react-spinners";
import { TextField } from "@mui/material";

export function PastBookings({ user }) {
  const [filterText, setFilterText] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { field: "id", headerName: "#", width: 80 },
    { field: "sessionType", headerName: "Session Type", width: 200 },
    { field: "sessionDate", headerName: "Date", width: 150 },
    { field: "startTime", headerName: "Start Time", width: 150 },
    { field: "endTime", headerName: "End Time", width: 150 },
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
    { field: "sessionAmount", headerName: "Amount", width: 130 },
    { field: "postalCode", headerName: "Postal Code", width: 120 },
    { field: "coachName", headerName: "Coach", width: 120 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getBookings({
          playerId: user._id,
          sessionStatus: ["completed", "canceled"],
          status: ["confirmed", "canceled"],
        });
        const formattedData = response.map((row, index) => ({
          id: index + 1,
          sessionType: row.sessionType,
          sessionDate: new Date(row.sessionDate).toLocaleDateString(),
          startTime: row.startTime,
          endTime: row.endTime,
          sessionAmount: `$${row.sessionAmount.toFixed(2)}`,
          postalCode: row.postalCode,
          coachName: row.coachId?.username || "N/A",
          sessionStatus: row.sessionStatus,
          paymentStatus: row.paymentStatus,
        }));
        setBookings(formattedData);
        setCsvData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredRows = bookings.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="text-[25px] font-semibold py-6">Past Sessions</p>
      <div className="flex justify-between items-center mb-4  gap-2">
        <TextField
          variant="outlined"
          label="Search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <IoIosSearch className="mr-2 text-xl" />,
          }}
        />
        <button className="flex items-center px-4 py-2 bg-main-dark hover:bg-main-accent rounded-md text-white">
          <FaDownload className="mr-2" />
          <CSVLink
            data={csvData}
            filename={"bookings.csv"}
            className="text-white"
          >
            Download CSV
          </CSVLink>
        </button>
      </div>
      <div className="h-[600px] w-full bg-white rounded-lg shadow-sm ">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 30, 50]}
          pagination
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}
