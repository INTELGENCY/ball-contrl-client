import React, { useEffect, useState } from "react";
import BreadCrums from "../../Components/BreadCrums/BreadCrums";
import { useSelector, useDispatch } from "react-redux";
import { removeFromBasket, clearBasket } from "../../redux/user/userBasket";
import delete_icon from "../../assets/Store/delete_icon.png";
import { useNavigate } from "react-router-dom";
import EmptyCart from "../../Components/EmptyCart/EmptyCart";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE);

const Basket = () => {
  const cartItems = useSelector((state) => state.basket.cartItems);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState(
    Object.keys(cartItems).reduce((acc, id) => {
      acc[id] = 1;
      return acc;
    }, {})
  );
 
  const [customerEmail, setCustomerEmail] = useState(currentUser? currentUser.email:"");
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: {
      line1: "",
      line2: "",
    },
    city: "",
    country: "",
    state: "",
    zip: "",
    phone: "",
  });

  useEffect(() => {
    console.log("cartitem", cartItems);
    console.log("cartarray", cartArray);
  }, []);

  const cartArray = currentUser ? Object.values(cartItems).filter((item) => item.Customer_id === currentUser._id) : Object.values(cartItems);

  const handleQuantityIncrease = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: prevQuantities[id] + 1,
    }));
  };

  const handleQuantityDecrease = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max(prevQuantities[id] - 1, 1),
    }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromBasket(id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address")) {
      const addressField = name === "addressLine1" ? "line1" : "line2";
      setShippingDetails((prevShippingDetails) => ({
        ...prevShippingDetails,
        address: {
          ...prevShippingDetails.address,
          [addressField]: value,
        },
      }));
    } else {
      setShippingDetails((prevShippingDetails) => ({
        ...prevShippingDetails,
        [name]: value,
      }));
    }
  };

  const handleProceedToCheckout = async () => {
    const stripe = await stripePromise;

    const items = cartArray.map((item) => ({
      Product_id: item._id,
      Product_name: item.name,
      Product_quantity: quantities[item._id],
      Product_price: item.new_price,
      Product_size: item.selectedSize,
    }));
    const size = items.map((item) => item.Product_size);
    const totalPrice = cartArray.reduce((total, item) => total + quantities[item._id] * item.new_price, 0);

    const body = {
      items,
      totalPrice,
      customerEmail,
      shippingDetails,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    console.log("Checkout Request Body:", JSON.stringify(body)); // Log the request body

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/store-checkout-session`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Handle non-2xx responses
        const errorText = await response.text();
        console.error("Server responded with an error:", errorText);
        return;
      }

      const session = await response.json();
      console.log("session", session);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const isEmpty = cartArray.length === 0;

  return (
    <div>
      {isEmpty ? (
        <div className="w-[83%] mx-auto">
          <EmptyCart />
        </div>
      ) : (
        <>
          <BreadCrums category="Basket" />
          <div>
            <div className="w-[87%] mx-auto pt-10">
              <h1 className="text-[24px] font-semibold">SHOPPING BASKET</h1>
            </div>
            <div className="w-[87%] mx-auto py-10">
              {/* Table container for responsiveness */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="border-b-2 text-start border-gray-300 p-2">
                        Image
                      </th>
                      <th className="border-b-2 border-gray-300 p-2">Name</th>
                      <th className="border-b-2 border-gray-300 p-2">Size</th>
                      <th className="border-b-2 border-gray-300 p-2">
                        Quantity
                      </th>
                      <th className="border-b-2 border-gray-300 p-2">Price</th>
                      <th className="border-b-2 border-gray-300 p-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartArray.map((cart, index) => (
                      <tr key={index}>
                        <td className="border-b p-2">
                          <img
                            className="w-[96px] h-[96px] flex justify-center border-2 border-gray-500"
                            src={cart.image}
                            alt={cart.name}
                          />
                        </td>
                        <td className="border-b text-center p-2">
                          {cart.name}
                        </td>
                        <td className="border-b text-center p-2">
                          {cart.selectedSize}
                        </td>
                        <td className="border-b p-2">
                          <div className="flex gap-5 w-[100px] mx-auto justify-center border-[1px] border-gray-400 items-center">
                            <button
                              className="h-[30px] text-center pt-1 cursor-pointer"
                              onClick={() => handleQuantityDecrease(cart._id)}
                            >
                              -
                            </button>
                            <span className="pt-1 h-[30px] text-center">
                              {quantities[cart._id]}
                            </span>
                            <button
                              className="h-[30px] text-center pt-1 cursor-pointer"
                              onClick={() => handleQuantityIncrease(cart._id)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="border-b text-center p-2">
                          ${quantities[cart._id] * cart.new_price}
                        </td>
                        <td className="border-b mt-8 p-2">
                          <img
                            onClick={() => handleRemoveItem(cart._id)}
                            className="lg:w-[25px] ml-[100px] cursor-pointer"
                            src={delete_icon}
                            alt="delete_icon"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-[87%] mx-auto">
              <button
                onClick={() => dispatch(clearBasket())}
                className="w-[200px] h-[45px] bg-main-dark hover:bg-main-accent text-white rounded-md"
              >
                Clear
              </button>
            </div>
            <div className="amount w-[87%] flex flex-col gap-[15px] mb-[3rem] py-10 mx-auto">
              <h1 className="uppercase text-[24px] font-semibold">
                Basket totals
              </h1>
              <div className="flex justify-between">
                <p className="font-medium text-[18px]">SubTotal</p>
                <p>
                  $
                  {cartArray.reduce(
                    (total, item) =>
                      total + quantities[item._id] * item.new_price,
                    0
                  )}
                </p>
              </div>
              <hr />
              <div className="shipping-fee flex justify-between">
                <p className="font-medium text-[18px]">Shipping Fee</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="total flex justify-between">
                <p className="font-bold text-[18px]">Total</p>
                <p>
                  $
                  {cartArray.reduce(
                    (total, item) =>
                      total + quantities[item._id] * item.new_price,
                    0
                  )}
                </p>
              </div>
              <div className="proceed flex flex-col ">
                {/* ---- */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-[200px] h-[45px] bg-main-dark hover:bg-main-accent text-white rounded-md"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Basket;
