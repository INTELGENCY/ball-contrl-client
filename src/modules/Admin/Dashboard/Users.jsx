import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Tab, Tabs, Box } from "@mui/material";
import { ClipLoader } from "react-spinners";
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaUserAlt 
} from "react-icons/fa";
import { getAllCoaches, getAllPlayers, deletePlayer, deleteCoach } from "../../../services/AdminApis";

const UsersManagement = () => {
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const data = await getAllPlayers();
      setPlayers(data.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const data = await getAllCoaches();
      setCoaches(data.data);
    } catch (error) {
      console.error("Error fetching coaches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlayer = async (id) => {
    try {
      setDeleting(true);
      await deletePlayer(id);
      await fetchPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCoach = async (id) => {
    try {
      setDeleting(true);
      await deleteCoach(id);
      await fetchCoaches();
    } catch (error) {
      console.error("Error deleting coach:", error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPlayers();
      await fetchCoaches();
    };
    fetchData();
  }, []);

  const playerColumns = [
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Phone", width: 150 },
    {
      field: "profilePicture",
      headerName: "Profile",
      width: 100,
      renderCell: (params) => (
        <div className="flex items-center justify-center">
          {params.value ? (
            <img
              src={params.value}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FaUserAlt className="w-6 h-6 text-main-darker" />
          )}
        </div>
      ),
    },
    { field: "city", headerName: "City", width: 120 },
    { field: "country", headerName: "Country", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex space-x-3">
          
          <button
            className="text-custom-red hover:text-red-700 transition-colors"
            onClick={() => handleDeletePlayer(params.row._id)}
            disabled={deleting}
            title="Delete"
          >
            {deleting ? (
              <ClipLoader size={16} color="#dc3545" />
            ) : (
              <FaTrash size={16} />
            )}
          </button>
        </div>
      ),
    },
  ];

  const coachColumns = [
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Phone", width: 150 },
    {
      field: "profilePic",
      headerName: "Profile",
      width: 100,
      renderCell: (params) => (
        <div className="flex items-center justify-center">
          {params.value ? (
            <img
              src={params.value}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <FaUserAlt className="w-6 h-6 text-main-darker" />
          )}
        </div>
      ),
    },
    { field: "experience", headerName: "Experience (years)", width: 150 },
    { field: "agegroup", headerName: "Age Group", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex space-x-3">
         
          <button
            className="text-custom-red hover:text-red-700 transition-colors"
            onClick={() => handleDeleteCoach(params.row._id)}
            disabled={deleting}
            title="Delete"
          >
            {deleting ? (
              <ClipLoader size={16} color="#dc3545" />
            ) : (
              <FaTrash size={16} />
            )}
          </button>
        </div>
      ),
    },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="user tabs"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#D850AB",
            }
          }}
        >
          <Tab 
            label="Players" 
            className={`${activeTab === 0 ? 'text-main-darker font-medium' : 'text-gray-500'}`} 
          />
          <Tab 
            label="Coaches" 
            className={`${activeTab === 1 ? 'text-main-darker font-medium' : 'text-gray-500'}`} 
          />
        </Tabs>
      </Box>

      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader size={50} color="#D850AB" />
          </div>
        ) : (
          <>
            {activeTab === 0 && (
              <div className="h-[500px] w-full">
                <DataGrid
                  rows={players}
                  columns={playerColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  getRowId={(row) => row._id}
                  disableSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#FEB7DC",
                      color: "#000",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "#D850AB",
                    },
                    "& .MuiDataGrid-cell": {
                      padding: "8px 16px",
                    },
                  }}
                />
              </div>
            )}
            {activeTab === 1 && (
              <div className="h-[500px] w-full">
                <DataGrid
                  rows={coaches}
                  columns={coachColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                  getRowId={(row) => row._id}
                  disableSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#FEB7DC",
                      color: "#000",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "#D850AB",
                    },
                    "& .MuiDataGrid-cell": {
                      padding: "8px 16px",
                    },
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;