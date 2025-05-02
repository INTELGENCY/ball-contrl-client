import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaWallet, FaStripe, FaCheckCircle } from "react-icons/fa";
import { signInSuccess } from "../../../redux/user/userSlice";

const StripeWallet = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  const createStripeAccount = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${BASE_URL}/coach/create-stripe-account`,
        {
          coachId: currentUser._id,
          email: currentUser.email,
          country: "GB", // Default to UK
        }
      );

      // Update user in Redux store
      dispatch(signInSuccess(response.data.user));

      // Set redirecting state and redirect to Stripe onboarding
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

      // Open Stripe dashboard in new tab
      window.open(response.data.url, "_blank");
    } catch (err) {
      console.error("Error visiting Stripe account:", err);
      setError(err.response?.data?.error || "Failed to access Stripe account");
    }
  };

  // Animation variants
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
          className={`bg-main-dark hover:bg-main-accent text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center ${
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

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <div className="relative">
          <FaStripe className="text-6xl text-indigo-500 mx-auto mb-4" />
          <FaCheckCircle className="absolute -top-1 -right-1 text-green-500 text-xl bg-white rounded-full" />
        </div>
      </motion.div>
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-4"
        variants={itemVariants}
      >
        Stripe Account Connected
      </motion.h2>
      <motion.p className="text-gray-600 mb-8 max-w-md" variants={itemVariants}>
        Your Stripe account is successfully connected. You can now manage your
        payments and view transactions.
      </motion.p>

      <motion.button
        onClick={visitStripeAccount}
        className="bg-main-dark hover:bg-main-accent text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaStripe className="mr-2" />
        Go to Stripe Dashboard
      </motion.button>

      {error && (
        <motion.p className="mt-4 text-red-500" variants={itemVariants}>
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default StripeWallet;
