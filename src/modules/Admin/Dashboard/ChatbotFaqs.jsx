import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Trash, Eye } from "lucide-react";

const ChatbotFaqs = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const [openView, setOpenView] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState({ question: "", answer: "" });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/chatBot/getAll`);
      setFaqs(response.data || []);
    } catch (error) {
      console.error("Error fetching FAQs", error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/chatBot/create`, formData);

      setFormData({
        question: "",
        answer: "",
      });
      setAddLoading(false);
      toast.success(response.data.message || "FAQ added successfully");
      fetchFaqs();
    } catch (error) {
      setAddLoading(false);
      console.error("Error adding FAQ", error);
      toast.error("Failed to add FAQ");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await axios.delete(`${BASE_URL}/chatBot/${id}`);
      setFaqs(faqs.filter((faq) => faq._id !== id));
      toast.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Error deleting FAQ", error);
      toast.error("Failed to delete FAQ");
    }
  };

  const handleView = (faq) => {
    setSelectedFaq(faq);
    setOpenView(true);
  };

  const columns = [
    {
      field: "question",
      headerName: "Question",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            width: "100%",
            maxWidth: "250px",
          }}
          title={params.value}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "answer",
      headerName: "Answer",
      flex: 2,
      minWidth: 300,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            width: "100%",
            maxWidth: "400px",
          }}
          title={params.value}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="View"
            color="primary"
            onClick={() => handleView(params.row)}
          >
            <Eye size={18} />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            <Trash size={18} />
          </IconButton>
        </>
      ),
    },
  ];

  // Filtered FAQs for search
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "add"
              ? "bg-main-dark text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add FAQ
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "view"
              ? "bg-main-dark text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("view")}
        >
          View FAQs
        </button>
      </div>

      {/* Add FAQ Form */}
      {activeTab === "add" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow-lg rounded-xl border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-main-darker mb-4">
            Create a New FAQ
          </h2>

          <input
            type="text"
            name="question"
            placeholder="Enter question..."
            value={formData.question}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-main-accent"
            required
          />

          <textarea
            name="answer"
            placeholder="Enter answer..."
            value={formData.answer}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-main-accent"
            rows={5}
            required
          />

          <button
            type="submit"
            className="mt-2 px-6 py-3 bg-main-accent text-white rounded-lg font-bold hover:bg-main-darker transition"
          >
            {addLoading ? "Adding..." : "Create FAQ"}
          </button>
        </form>
      )}

      {/* View FAQs Section */}
      {activeTab === "view" && (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-main-darker mb-4">All FAQs</h2>
          <Box sx={{ mb: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search FAQ..."
              value={search}
              onChange={handleSearchChange}
              fullWidth
            />
          </Box>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={filteredFaqs.map((faq, idx) => ({
                ...faq,
                id: faq._id || idx, // DataGrid needs "id" prop
              }))}
              columns={columns}
              pageSize={8}
              rowsPerPageOptions={[8, 20, 50]}
              disableSelectionOnClick
              sx={{
                "& .MuiDataGrid-cell": { whiteSpace: "break-spaces" },
                "& .MuiDataGrid-root": { borderRadius: 2 },
              }}
            />
          </div>
        </div>
      )}

      {/* Modal for viewing FAQ */}
      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>View FAQ</DialogTitle>
        <DialogContent dividers>
          <div className="mb-4">
            <strong>Question:</strong>
            <div
              className="mt-1 text-gray-800"
              style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: selectedFaq.question || "" }}
            />
          </div>
          <div>
            <strong>Answer:</strong>
            <div
              className="mt-1 text-gray-800"
              style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: selectedFaq.answer || "" }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenView(false)}
            color="primary"
            variant="contained"
            sx={{ background: "#FD86C8" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ChatbotFaqs;
