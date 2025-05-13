import axios from "axios";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaMoneyCheck,
  FaPoundSign,
  FaStripe,
  FaWallet,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { signInSuccess } from "../../../redux/user/userSlice";
import {
  fetchStripeBalance,
  fetchStripePayouts,
} from "../../../services/CoachApi";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const StripeWallet = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { currentUser } = useSelector((state) => state.user);
  const [balance, setBalance] = useState({});
  const [payouts, setPayouts] = useState([]);
  const [fetchDataLoading, setFetchDataLoading] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  const transformedRows = payouts?.data?.map((item, index) => ({
    id: item.id,
    amount: `£ ${(item.amount / 100).toFixed(2)}`,
    status: item.status,
    method: item.method,
    type: item.type,
    arrival_date: new Date(item.arrival_date * 1000).toLocaleDateString(),
    created: new Date(item.created * 1000).toLocaleString(),
  }));

  useEffect(() => {
    if (currentUser?.stripeAccountId) {
      fetchData();
    }
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setFetchDataLoading(true);
      const dataToSend = {
        accountId: currentUser.stripeAccountId,
      };
      const [balanceResponse, payoutsResponse] = await Promise.all([
        fetchStripeBalance(dataToSend),
        fetchStripePayouts(dataToSend),
      ]);
      setBalance(balanceResponse?.balance);
      setPayouts(payoutsResponse?.payouts);
      setFetchDataLoading(false);
    } catch (error) {
      console.log(error);
      setFetchDataLoading(false);
    }
  };

  const createStripeAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${BASE_URL}/coach/create-stripe-account`,
        {
          coachId: currentUser._id,
          email: currentUser.email,
          country: "GB",
        }
      );
      dispatch(signInSuccess(response.data.user));
      setRedirecting(true);
      window.location.href = response.data.url;
    } catch (err) {
      console.error("Error creating Stripe account:", err);
      setError(err.response?.data?.error || "Failed to connect Stripe account");
    } finally {
      setLoading(false);
    }
  };

  const visitStripeAccount = async () => {
    try {
      if (!currentUser.stripeAccountId) {
        throw new Error("No Stripe account connected");
      }
      const response = await axios.post(
        `${BASE_URL}/coach/stripe-account-login-link`,
        {
          accountId: currentUser.stripeAccountId,
        }
      );
      window.open(response.data.url, "_blank");
    } catch (err) {
      console.error("Error visiting Stripe account:", err);
      setError(err.response?.data?.error || "Failed to access Stripe account");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const gbpAvailable = balance?.available?.find((b) => b.currency === "gbp");
  const availableAmount = gbpAvailable ? gbpAvailable.amount / 100 : 0;
  const gbpPending = balance?.pending?.find((b) => b.currency === "gbp");
  const pendingAmount = gbpPending ? gbpPending.amount / 100 : 0;
  const gbpInstant = balance?.instant_available?.find(
    (b) => b.currency === "gbp"
  );
  const instantAmount = gbpInstant ? gbpInstant.amount / 100 : 0;

  const columns = [
    { field: "id", headerName: "Payout ID", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            params.value === "paid"
              ? "bg-green-100 text-green-800"
              : params.value === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    { field: "method", headerName: "Method", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "arrival_date", headerName: "Arrival Date", width: 150 },
    { field: "created", headerName: "Created At", width: 150 },
  ];

  if (!currentUser) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <FaWallet className="text-6xl text-purple-500 mx-auto mb-4" />
        </motion.div>
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-4"
          variants={itemVariants}
        >
          Connect Your Wallet
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-8 max-w-md"
          variants={itemVariants}
        >
          Please sign in to access your payment wallet and manage your Stripe
          account.
        </motion.p>
      </motion.div>
    );
  }

  if (redirecting) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <ClipLoader color="#ec2e7d" size={60} />
        </motion.div>
        <motion.h2
          className="text-2xl font-bold text-gray-800 mt-6"
          variants={itemVariants}
        >
          Redirecting to Stripe...
        </motion.h2>
        <motion.p className="text-gray-600 mt-2" variants={itemVariants}>
          Please complete the onboarding process to connect your account
        </motion.p>
      </motion.div>
    );
  }

  if (!currentUser.stripeAccountId) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <FaStripe className="text-6xl text-indigo-500 mx-auto mb-4" />
        </motion.div>
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-4"
          variants={itemVariants}
        >
          Connect Stripe Account
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-8 max-w-md"
          variants={itemVariants}
        >
          Before Creating a session and to receive payments, you need to connect
          your Stripe account. It only takes a minute!
        </motion.p>
        <motion.button
          onClick={createStripeAccount}
          disabled={loading}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? (
            <>
              <ClipLoader color="#ffffff" size={20} className="mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <FaStripe className="mr-2" />
              Connect Stripe Account
            </>
          )}
        </motion.button>
        {error && (
          <motion.p className="mt-4 text-red-500" variants={itemVariants}>
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }

  if (fetchDataLoading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <ClipLoader color="#ec2e7d" size={60} />
        </motion.div>
        <motion.h2
          className="text-2xl font-bold text-gray-800 mt-6"
          variants={itemVariants}
        >
          Loading Wallet Data...
        </motion.h2>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-end mb-6">
        <motion.button
          onClick={visitStripeAccount}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaStripe className="mr-2" />
          Go to Stripe Dashboard
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaMoneyCheck className="text-blue-600 text-4xl mr-3" />
                <h3 className="text-lg font-bold text-gray-800">Balance</h3>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                £ {availableAmount.toFixed(2)}
              </h4>
              <p className="text-gray-500 text-sm">
                Funds that are fully processed and ready to be transferred to
                your bank.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pending Balance Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaMoneyBillWave className="text-green-600 text-4xl mr-3" />
                <h3 className="text-lg font-bold text-gray-800">
                  Pending Balance
                </h3>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                £ {pendingAmount.toFixed(2)}
              </h4>
              <p className="text-gray-500 text-sm">
                Funds from recent payments, currently being processed by Stripe.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Instant Payout Eligible Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <FaPoundSign className="text-orange-600 text-4xl mr-3" />
                <h3 className="text-lg font-bold text-gray-800">
                  Instant Payout Eligible
                </h3>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                £ {instantAmount.toFixed(2)}
              </h4>
              <p className="text-gray-500 text-sm">
                Funds you can instantly transfer to your bank (Stripe may charge
                a small fee).
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payouts DataGrid */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Recent Payouts
            </h3>
            <div className="w-full" style={{ height: 400 }}>
              <DataGrid
                rows={transformedRows || []}
                columns={columns}
                pageSize={5}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                className="border-none"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.p
          className="mt-4 text-red-500 text-center"
          variants={itemVariants}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default StripeWallet;
