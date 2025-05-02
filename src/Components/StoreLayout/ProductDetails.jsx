import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Category.css";
import { BiPlus } from "react-icons/bi";
import BreadCrums from "../BreadCrums/BreadCrums";
import Mightlike from "../MightLike/Mightlike";
import { useDispatch, useSelector } from "react-redux";
import { addToBasket } from "../../redux/user/userBasket";
import { toast } from "react-toastify";
import start_icon from "../../assets/Store/star_icon.png";
import start_dull_icon from "../../assets/Store/star_dull_icon.png";
import { ClipLoader } from "react-spinners";
import shop21 from "../../assets/png/shop25.png";

const ProductDetails = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.basket.cartItems);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [extraInfo, setExtraInfo] = useState();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/product/getproducts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const dataCollection = data.filter((product) => product._id === id);
          setProductData(dataCollection[0]);
        } else {
          console.error("Failed to fetch products:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    console.log("product data is", productData);
  }, [productData]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (currentUser) {
      const itemId = productData._id;
      const Customer_id = currentUser._id;
      const Customer_phone = extraInfo?.phoneNumber;
      const Customer_address = extraInfo?.address_line_1;
      const item = { ...productData, selectedSize, Customer_id, Customer_phone, Customer_address };
      if (cartItems[itemId]) {
        toast.warning("Item is already in the cart");
      } else {
        dispatch(addToBasket(item));
        console.log("add to cart", cartItems);
        toast.success("Item added to cart");
      }
    } else {
      toast.warning("Please Login To Your Account");
    }
  };

  useEffect(() => {
    console.log("items use effect added to cart", cartItems);
  }, [cartItems]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let url;
        if (currentUser.userType === "Player") {
          url = `${import.meta.env.VITE_BASE_URL}/player/profile/${currentUser._id}`;
        } else if (currentUser.userType === "Coach") {
          url = `${import.meta.env.VITE_BASE_URL}/coach/profile/${currentUser._id}`; // Replace with the actual URL for Coach
        }

        if (url) {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setExtraInfo(data);
          } else {
            console.error("Failed to fetch user profile:", response.statusText);
          }
        } else {
          console.error("Unknown user type");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (currentUser?._id) {
      fetchUser();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedSize.length > 0) {
      toast.info(`selected size is ${selectedSize}`);
    }
  }, [selectedSize]);

  return (
    <>
      {isLoading || productData.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#fd86c8" />
        </div>
      ) : (
        <>
          <BreadCrums category={productData.category} name={productData.name} />
          <div className="w-[83%] py-10 product_data mx-auto">
            <div className="flex gap-[17px]">
              <div className="side flex flex-col h-[512px] gap-[10px]">
                <img
                  src={shop21}
                  className="h-[95px] w-[95px] lg:h-[120px] lg:w-[129px] object-cover"
                  alt=""
                />
                <img
                  src={shop21}
                  className="h-[95px] w-[95px] lg:h-[120px] lg:w-[129px] object-cover"
                  alt=""
                />
                <img
                  src={shop21}
                  className="h-[95px] w-[95px] lg:h-[120px] lg:w-[129px] object-cover"
                  alt=""
                />
                <img
                  src={shop21}
                  className="h-[95px] w-[95px] lg:h-[120px] lg:w-[129px] object-cover"
                  alt=""
                />
              </div>
              <div className="left w-full">
                <img
                  src={shop21}
                  className="h-[412px] w-[386px] lg:h-[512px] lg:w-[586px] object-cover"
                  alt={productData.name}
                />
              </div>
            </div>
            <div className="right">
              <div className="mb-3">
                <h1 className="text-[28px] lato-font font-medium">
                  Ball Control
                </h1>
                <h1 className="text-[40px] lato-font font-semibold">
                  {productData.name}
                </h1>
              </div>
              <div className="flex items-center lato-font gap-[10px] my-6">
                {productData.old_price && (
                  <p className="line-through text-[#767676] text-[24px] font-medium">
                    ${productData.old_price}
                  </p>
                )}
                <p className="text-[24px] text-[#ff4141] font-semibold">
                  ${productData.new_price}
                </p>
              </div>
              <p className="my-6 lato-font">{productData.description}</p>
              <div className="flex lato-font gap-10 items-center my-3">
                <div>
                  4k+ <span className="text-[#6B6565]">sold</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={start_icon} alt="" />{" "}
                  <img src={start_icon} alt="" />{" "}
                  <img src={start_icon} alt="" />{" "}
                  <img src={start_dull_icon} alt="" />{" "}
                  <span className="text-[#6B6565]">(10)</span>
                </div>
              </div>
              <div className="sizes lato-font my-6">
                <div className="flex gap-4">
                  <h1>
                    Select <span className="text-[14px]">Size</span>{" "}
                    <span className="text-red-600">*</span>{" "}
                  </h1>
                  <h1 className="border-b-2 border-gray-700">
                    View <span className="text-[14px]">Size guide</span>
                  </h1>
                </div>
                <div className="text-white lato-font font-normal text-[18px] my-6 grid grid-cols-5 md:grid-cols-5  gap-2 md:gap-5">
                  <div
                    onClick={() => setSelectedSize("S")}
                    value={"S"}
                    className="py-3 px-3 bg-[#fd86c8] border-[1px]  rounded-lg  cursor-pointer"
                  >
                    S
                  </div>
                  <div
                    onClick={() => setSelectedSize("M")}
                    value={"M"}
                    className="py-3 px-3 bg-[#fd86c8] border-[1px]  rounded-lg  cursor-pointer"
                  >
                    M
                  </div>
                  <div
                    onClick={() => setSelectedSize("L")}
                    value={"L"}
                    className="py-3 px-3 bg-[#fd86c8] border-[1px]  rounded-lg  cursor-pointer"
                  >
                    L
                  </div>
                  <div
                    onClick={() => setSelectedSize("XL")}
                    value={"XL"}
                    className="py-3 px-3 bg-[#fd86c8] border-[1px]  rounded-lg  cursor-pointer"
                  >
                    XL
                  </div>
                  <div
                    onClick={() => setSelectedSize("XXL")}
                    value={"XXL"}
                    className="py-3 px-3 bg-[#fd86c8] border-[1px] rounded-lg cursor-pointer"
                  >
                    XXL
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={handleAddToCart}
                  className="flex gap-2 w-[100%] lato-font rounded-lg justify-center h-[45px] items-center text-white uppercase bg-[#FD86C8]"
                >
                  <BiPlus /> Add to Cart
                </button>
              </div>
            </div>
          </div>
          <Mightlike record={id} category={productData.category} />{" "}
        </>
      )}
    </>
  );
};

export default ProductDetails;
