import { Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { getBookings, releasePayment } from "../../../services/AdminApis";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import moment from "moment";

const AllBookings = () => {
  const [filterInput, setFilterInput] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [releaseLoading, setReleaseLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const dataToSend = {
        status: "confirmed",
      };
      const response = await getBookings(dataToSend);
      const bookingsWithPlayerName = response.map((booking) => ({
        ...booking,
        playerName: booking?.playerId?.username || "N/A",
      }));

      setBookings(bookingsWithPlayerName);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const formattedData = bookings.map((row) => ({
      sessionType: row.sessionType,
      sessionDate: row?.sessionDate,
      startTime: row?.startTime,
      endTime: row?.endTime,
      sessionAmount: `$${row?.sessionAmount?.toFixed(2)}`,
      postalCode: row?.postalCode,
      playerName: row.playerId ? row?.playerId?.username : "N/A",
    }));
    setCsvData(formattedData);
  }, [bookings]);

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
      setReleaseLoading(true);
      try {
        const response = await releasePayment(id);
        if (response.success) {
          Swal.fire({
            title: "Released!",
            text: "Payment has been released successfully.",
            icon: "success",
            confirmButtonColor: "#FF6AB9",
          });
          // Update local state instead of reloading
          fetchBookings();
          setReleaseLoading(false);
        } else {
          setReleaseLoading(false);

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

  const columns = [
    {
      field: "_id",
      headerName: "Session ID",
      width: 250,
    },
    {
      field: "sessionType",
      headerName: "Session Type",
      width: 150,
    },
    {
      field: "sessionDate",
      headerName: "Date",
      width: 120,
      renderCell: (params) => {
        const formattedDate = params?.value
          ? moment(params.value).format("DD/MM/YYYY")
          : "N/A";
        return <span>{formattedDate}</span>;
      },
    },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 120,
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 120,
    },
    {
      field: "sessionAmount",
      headerName: "Amount",
      width: 120,
    },
    {
      field: "sessionStatus",
      headerName: "Session Status",
      width: 150,
      renderCell: (params) => {
        let statusColor;
        switch (params.value) {
          case "not started":
            statusColor = "bg-gray-600";
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
      field: "postalCode",
      headerName: "Postal Code",
      width: 120,
    },
    {
      field: "playerName",
      headerName: "Player",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isButtonDisabled = !(
          params.row.sessionStatus === "completed" &&
          params.row.paymentStatus === "requires capture"
        );

        return (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleReleasePayment(params.row._id)}
            disabled={isButtonDisabled || releaseLoading}
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
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />;
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <p className="text-[25px] font-semibold py-6">Active Bookings</p>
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
            filename={"bookings.csv"}
            className="text-black"
          >
            Download CSV
          </CSVLink>
        </button>
      </div>

      <Box sx={{ height: 600, width: "100%", backgroundColor: "white" }}>
        <DataGrid
          rows={bookings}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 30, 50]}
          pagination
          disableSelectionOnClick
          getRowId={(row) => row._id}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f3f4f6",
              fontSize: "1rem",
            },
            "& .MuiDataGrid-cell": {
              padding: "8px 16px",
            },
          }}
        />
      </Box>
    </div>
  );
};

export default AllBookings;
