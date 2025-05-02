import { Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { FaDownload } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { changeSessionStatus, getBookings } from "../../../services/CoachApi";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Radio,
  FormControlLabel,
  Divider,
} from "@mui/material";
import moment from "moment/moment";

const AllBookings = ({ user }) => {
  const [filterInput, setFilterInput] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const getSessionDetails = async () => {
      try {
        setLoading(true);
        const dataToSend = {
          coachId: user._id,
          status: "confirmed",
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
    const formattedData = bookings.map((row) => ({
      sessionType: row.sessionType,
      sessionDate: new Date(row.sessionDate).toLocaleDateString(),
      startTime: row.startTime,
      endTime: row.endTime,
      sessionAmount: `$${row.sessionAmount.toFixed(2)}`,
      sessionStatus: row.sessionStatus,
      postalCode: row.postalCode,
      playerName: row.playerId ? row.playerId.username : "N/A",
    }));
    setCsvData(formattedData);
  }, [bookings]);

  const handleStatusMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    setSelectedStatus(row.sessionStatus);
  };

  const handleStatusMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleStatusChange = async () => {
    if (!selectedRow) return;

    try {
      const response = await changeSessionStatus(
        selectedRow._id,
        selectedStatus
      );
      if (response.success) {
        Swal.fire({
          title: "Success",
          text: "Status has been updated successfully",
          icon: "success",
          confirmButtonColor: "#FF6AB9",
        });
        // Update local state instead of reloading
        setBookings(
          bookings.map((booking) =>
            booking._id === selectedRow._id
              ? { ...booking, sessionStatus: selectedStatus }
              : booking
          )
        );
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to update status",
          icon: "error",
          confirmButtonColor: "red",
        });
      }
    } catch (error) {
      console.error("Error changing status:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
      });
    } finally {
      handleStatusMenuClose();
    }
  };

  const columns = [
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
    {
      field: "postalCode",
      headerName: "Postal Code",
      width: 120,
    },
    {
      field: "playerId.username",
      headerName: "Player",
      width: 150,
      valueGetter: (params) => params?.row?.playerId?.username || "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={(event) => handleStatusMenuClick(event, params.row)}
            sx={{
              backgroundColor: "#FD86C8",
              "&:hover": { backgroundColor: "#FF6AB9" },
            }}
          >
            Change Status
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
    <div className="p-4 w-full">
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

      <Box
        sx={{
          height: 600,
          width: "100%",
          backgroundColor: "white",
        }}
      >
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

      {/* Status Change Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleStatusMenuClose}
        PaperProps={{
          style: {
            width: 250,
            padding: "8px",
          },
        }}
      >
        <MenuItem disabled sx={{ fontWeight: "bold" }}>
          Change Status
        </MenuItem>
        <Divider />
        <MenuItem>
          <FormControlLabel
            control={
              <Radio
                checked={selectedStatus === "not started"}
                onChange={() => setSelectedStatus("not started")}
              />
            }
            label="Not Started"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Radio
                checked={selectedStatus === "ongoing"}
                onChange={() => setSelectedStatus("ongoing")}
              />
            }
            label="Ongoing"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Radio
                checked={selectedStatus === "completed"}
                onChange={() => setSelectedStatus("completed")}
              />
            }
            label="Completed"
          />
        </MenuItem>
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <Button
            onClick={handleStatusMenuClose}
            sx={{ mr: 1, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusChange}
            variant="contained"
            color="primary"
            size="small"
            sx={{
              backgroundColor: "#FD86C8",
              "&:hover": { backgroundColor: "#FF6AB9" },
            }}
          >
            Save
          </Button>
        </Box>
      </Menu>
    </div>
  );
};

export default AllBookings;
