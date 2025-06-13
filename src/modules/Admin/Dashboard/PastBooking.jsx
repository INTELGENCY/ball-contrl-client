import React, { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, CircularProgress, TextField } from "@mui/material";
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { getBookings } from "../../../services/AdminApis";

export function PastBookings() {
  const [filterInput, setFilterInput] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookings
  useEffect(() => {
    const getSessionDetails = async () => {
      try {
        setLoading(true);
        const dataToSend = {
          sessionStatus: ["completed", "canceled"],
          status: ["completed", "canceled"],
          paymentStatus: ["completed", "canceled", "refunded"],
        };
        const response = await getBookings(dataToSend);
        setBookings(
          response.map((row, idx) => ({
            id: row._id || idx, // DataGrid requires id
            _id: row._id,
            sessionType: row.sessionType,
            sessionDate: new Date(row.sessionDate).toLocaleDateString(),
            startTime: row.startTime,
            endTime: row.endTime,
            sessionAmount: row.sessionAmount,
            sessionStatus: row.sessionStatus,
            paymentStatus: row.paymentStatus,
            postalCode: row.postalCode,
            playerName: row.playerId ? row.playerId.username : "N/A",
          }))
        );
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getSessionDetails();
  }, []);

  // CSV Export Data
  useEffect(() => {
    const formattedData = bookings.map((row) => ({
      sessionType: row.sessionType,
      sessionDate: row.sessionDate,
      startTime: row.startTime,
      endTime: row.endTime,
      sessionAmount: `$${Number(row.sessionAmount).toFixed(2)}`,
      postalCode: row.postalCode,
      playerName: row.playerName,
    }));
    setCsvData(formattedData);
  }, [bookings]);

  // Columns Definition for DataGrid
  const columns = useMemo(
    () => [
      { field: "_id", headerName: "Session Id", width: 170 },
      { field: "sessionType", headerName: "Session Type", width: 140 },
      { field: "sessionDate", headerName: "Date", width: 120 },
      { field: "startTime", headerName: "Start Time", width: 120 },
      { field: "endTime", headerName: "End Time", width: 120 },
      {
        field: "sessionAmount",
        headerName: "Amount",
        width: 110,
        // valueFormatter: (params) => `$${Number(params.value).toFixed(2)}`,
      },
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
      { field: "postalCode", headerName: "Postal Code", width: 100 },
      { field: "playerName", headerName: "Player", width: 140 },
    ],
    []
  );

  // Filter/Global Search
  const filteredRows = bookings.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(filterInput.toLowerCase())
  );

  return (
    <div className="p-4">
      <p className="text-[25px] font-semibold py-6">Past Bookings</p>
      <div className="flex justify-between mb-4 items-center gap-2 flex-wrap">
        <TextField
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
          label="Search"
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <IoIosSearch className="mr-2 text-xl" />,
          }}
        />
        <Button
          variant="contained"
          startIcon={<FaDownload />}
          sx={{
            backgroundColor: "#FD86C8",
            "&:hover": { backgroundColor: "#FF6AB9" },
          }}
        >
          <CSVLink
            data={csvData}
            filename={"bookings.csv"}
            className="text-white no-underline"
          >
            Download CSV
          </CSVLink>
        </Button>
      </div>
      {loading ? (
        <div className="w-full h-[600px] flex justify-center items-center">
          <CircularProgress color="secondary" size={45} />
        </div>
      ) : (
        <div style={{ width: "100%", height: 600 }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 30, 50]}
            disableRowSelectionOnClick
            disableColumnMenu={false}
            autoHeight={false}
            sx={{
              "& .MuiDataGrid-columnHeaders": { background: "#ffe4fa" },
            }}
            localeText={{
              noRowsLabel: "No results found 🙁",
            }}
          />
        </div>
      )}
    </div>
  );
}
