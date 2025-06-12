import React, { useEffect, useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Button, CircularProgress, Stack } from "@mui/material";
import { getBookings } from "../../../services/PlayerApis";
import { CSVLink } from "react-csv";
import moment from "moment";
import { FaDownload } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { releasePayment } from "../../../services/AdminApis";

export function AllBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getBookings({
        playerId: user._id,
        status: "confirmed",
        sessionStatus: ["not started", "ongoing"],
      });
      const formatted = response.map((row, index) => ({
        id: index + 1,
        sessionType: row.sessionType,
        sessionDate: moment(row.SessionDate).format("MMM Do YY"),
        startTime: row.startTime,
        endTime: row.endTime,
        sessionAmount: `$${row.sessionAmount?.toFixed(2)}`,
        postalCode: row.postalCode,
        sessionStatus: row.sessionStatus,
        coach: row.coachId?.username || "N/A",
      }));
      setBookings(formatted);
      setFilteredBookings(formatted);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = bookings.filter((row) =>
      Object.values(row).some((field) =>
        String(field).toLowerCase().includes(value)
      )
    );
    setFilteredBookings(filtered);
  };

  const handleReleasePayment = async (id) => {
    const isConfirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to release this payment",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, release it!",
    });

    if (isConfirmed.isConfirmed) {
      try {
        const response = await releasePayment(id);
        if (response.success) {
          Swal.fire({
            title: "Released!",
            text: "Payment has been released successfully.",
            icon: "success",
            confirmButtonColor: "#FF6AB9",
          });
          fetchBookings();
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to release payment",
            icon: "error",
            confirmButtonColor: "red",
          });
        }
      } catch (error) {
        console.error("Error releasing payment:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to release payment",
          icon: "error",
        });
      }
    }
  };

  const columns = useMemo(
    () => [
      { field: "sessionType", headerName: "Session Type", width: 150 },
      { field: "sessionDate", headerName: "Date", width: 120 },
      { field: "startTime", headerName: "Start Time", width: 120 },
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
      { field: "coach", headerName: "Coach", width: 120 },
      {
        field: "actions",
        headerName: "Actions",
        width: 330,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const isButtonDisabled = !(
            params.row.sessionStatus === "completed" &&
            params.row.paymentStatus === "requires capture"
          );
          return (
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
              mt={1}
            >
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate("/player-dashboard?tab=chatbox")}
                sx={{
                  backgroundColor: "#FD86C8",
                  "&:hover": { backgroundColor: "#FF6AB9" },
                }}
              >
                Message Coach
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleReleasePayment(params.row._id)}
                disabled={isButtonDisabled}
                sx={{
                  backgroundColor: isButtonDisabled ? "#e5e7eb" : "#10b981",
                  "&:hover": {
                    backgroundColor: isButtonDisabled ? "#e5e7eb" : "#059669",
                  },
                  "&:disabled": {
                    color: "#9ca3af",
                  },
                }}
              >
                Release Payment
              </Button>
            </Stack>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <p className="text-[25px] font-semibold py-6">Active Bookings</p>

      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <TextField
          variant="outlined"
          label="Search"
          value={searchText}
          onChange={handleSearch}
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
            data={filteredBookings}
            filename="bookings.csv"
            className="text-white no-underline"
          >
            Download CSV
          </CSVLink>
        </Button>
      </div>

      {loading ? (
        <div className="h-[500px] flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredBookings}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 30, 50]}
            disableRowSelectionOnClick
          />
        </div>
      )}
    </div>
  );
}
