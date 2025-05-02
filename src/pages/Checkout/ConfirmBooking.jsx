import moment from "moment";
import tick_icon from "../../../src/assets/images/tick_icon.png";
const ConfirmBooking = ({ bookingData }) => {
  // Dummy JSON data
  const data = {
    order: {
      id: bookingData?._id,
      date: moment(bookingData?.sessionDate).format("YYYY-MM-DD"),
      paymentMethod: "Stripe",
      name: "Flowbite Studios LLC",
      address: bookingData?.postalCode,
      phone: "+(123) 456 7890",
    },
    messages: {
      thankYou: "Thanks for your order!",
      orderInfo: "",
    },
    buttons: {
      trackOrder: "Track your order",
      returnShopping: "Return to shopping",
    },
  };

  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-2xl px-4 2xl:px-0 text-center">
        <img src={tick_icon} alt="tick_img" className="mx-auto" />
        {/* Thank You Message */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl mb-2 mt-6">
          {data.messages.thankYou}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 md:mb-8">
          {data.messages.orderInfo.replace(
            "{orderId}",
            <a
              href="#"
              className="font-medium text-gray-900 dark:text-white hover:underline"
            >
              {data.order.id}
            </a>
          )}
        </p>

        {/* Order Details */}
        <div className="space-y-4 sm:space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800 mb-6 md:mb-8">
          {Object.entries(data.order).map(([key, value]) => (
            <dl
              key={key}
              className="sm:flex items-center justify-between gap-4"
            >
              <dt className="font-normal mb-1 sm:mb-0 text-gray-500 dark:text-gray-400">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </dt>
              <dd className="font-medium text-gray-900 dark:text-white sm:text-end">
                {value}
              </dd>
            </dl>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          >
            {data.buttons.trackOrder}
          </a>
        </div>
      </div>
    </section>
  );
};

export default ConfirmBooking;
