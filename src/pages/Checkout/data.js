const dummyData = {
  logoSrc: "https://via.placeholder.com/150",
  handleBookNow: () => alert("Book Now clicked"),
  handleNext: () => alert("Go To Pay clicked"),
  handleViewBookingDetails: () => alert("View Booking Details clicked"),
  quoteData: {
    basePrice: 25,
    guestLimit: 40,
    quoteAmount: 1000,
    initialDeposit: "20%",
    paymentIntentId: null,
    paymentStatus: "pending",
    status: "pending",
  },
  loading: false,
};

export default dummyData;