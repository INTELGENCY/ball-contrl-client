import React, { useEffect, useState } from "react";
import "./Success.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { MdOutlineShoppingBag } from "react-icons/md";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const Success = () => {
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const sessionId = queryParams.get("session_id");
  const navigate = useNavigate()

  // orderID
  useEffect(() => {
    const sendData = async () => {
      try {
        if (!sessionId) {
          return null;
        }

        const orderId = sessionId;
        console.log("order id for order", orderId);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/orderdata/${orderId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        if (response.ok) {
          toast.success("order data is saved");
        }
      } catch (error) {
        console.log(error);
      }
    };
    sendData();
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      const fetchSessionDetails = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/get-session-details?session_id=${sessionId}`);
          setSessionDetails(response.data);
          console.log("1", sessionDetails);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching session details:", error);
          setLoading(false);
        }
      };
      fetchSessionDetails();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#fd86c8" />
      </div>
    );
  if (!sessionDetails) return <p>Unable to retrieve session details.</p>;

  const order = {
    id: sessionDetails.id,
    name: sessionDetails.customer_details.name,
    email: sessionDetails.customer_details.email,
    address: `${sessionDetails.customer_details.address.line1}, ${sessionDetails.customer_details.address.city}, ${sessionDetails.customer_details.address.country} ${sessionDetails.customer_details.address.postal_code}`,
    paymentMethod: sessionDetails.payment_method_types[0], // Assuming single payment method
    items: sessionDetails.line_items.map((item) => ({
      name: item.description,
      size: item.metadata.size || "N/A", // Retrieve size from metadata
      quantity: item.quantity,
      price: item.amount_total / 100, // Assuming amount is in cents
      image: item.metadata.image || "https://via.placeholder.com/150", // Retrieve image from metadata ...
    })),
    shipping: sessionDetails.total_details.amount_shipping / 100,
    tax: sessionDetails.total_details.amount_tax / 100,
    amount_total: sessionDetails.amount_total / 100,
    amount_subtotal: sessionDetails.amount_subtotal / 100,
  };

  const subtotal = order.amount_subtotal;
  const total = order.amount_total;
  const truncateString = (str, num) => {
    return str?.length > num ? str.slice(0, num) + "..." : str;
  };
 
  const handleContinue = () => {
   navigate("/store");
 }

  return (
    <div className="checkout-container w-[100%]">
      <div style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }} className="shadow-lg flex w-full px-10 py-10">
        <div className="order-summary">
          <h2 className="font-semibold pb-6 text-[32px]">Checkout</h2>
          <div className="flex gap-[10px]">
            <RiCheckboxCircleLine size={40} />
            <div>
              <p className="font-bold">
                Order <span className="font-bold">#</span> <span className="text-[16px] font-normal">{truncateString(order.id, 45)}</span>
              </p>
              <h3 className="font-semibold">Thank you {order.name}!</h3>
            </div>
          </div>
          <div className="order-details my-9">
            <table className="table-auto shadow-lg border-[1px] p-3 w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border px-5 py-4 font-bold">Contact</td>
                  <td className="border px-4 py-4">{order.email}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-4 font-bold">Address</td>
                  <td className="border px-4 py-4">{order.address}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-4 font-bold">Payment</td>
                  <td className="border px-4 py-4 capitalize">{order.paymentMethod}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="w-[15px] h-[15px] border-[1px] rounded-full mt-2 bg-black"></div>
              <div>
                <p className="mt-3">
                  Need help?
                  <a href="#" className="text-[#318CE7] pl-1">
                    Contact Us
                  </a>
                </p>
              </div>
            </div>
            <button onClick={handleContinue} className="continue-shopping-btn font-semibold">Continue Shopping</button>
          </div>
        </div>
        <div className="border-[1px] border-l-[1px]"></div>
        <div className="your-order">
          <div className="font-bold text-[32px] flex items-center gap-[8px]">
            <MdOutlineShoppingBag />
            <div className="flex items-center gap-[5px]">
              <h3>Your Order</h3>
              <span className="bg-black text-white rounded-full mt-1 h-[25px] w-[25px] text-center text-[16px]">{order.items.length}</span>
            </div>
          </div>
          {order.items.map((item, index) => (
            <>
              <div className="order-item" key={index}>
                <img src={item.image} alt={item.name} />
                <div className="item-details  w-full">
                  <p className="font-semibold">{item.name}</p>
                  <p>Size: {item.size}</p>
                  <div className="flex items-center justify-between w-full">
                    <p className="font-medium">Quantity # {item.quantity}</p>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <hr />
            </>
          ))}
          <div className="order-summary-totals">
            <div className="my-2">
              <div className="flex justify-between">
                <p className="font-semibold">Subtotal</p>
                <p className="font-semibold">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-semibold">Shipping</p>
                <p className="font-semibold">${order.shipping.toFixed(2)}</p>
              </div>
              <hr />
              <div className="mt-2">
                <div className="flex justify-between">
                  <p className="font-semibold">Tax</p>
                  <p className="font-semibold">${order.tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-bold">Total</p>
                  <p className="font-bold">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
