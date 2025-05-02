import React, { useRef, useState, useEffect } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storeData } from "../../data/Home";
import { ClipLoader } from "react-spinners";

const StoreSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  const templateIds = [
    "c1d4ef56-8b38-475b-a17c-a4106848f838",
    "1f1fb597-632b-4569-a0db-c9eed58626ad",
    "6c26d045-7567-49f6-90c9-73fe65d9bd07",
    "de0e7b9c-eae1-4c07-b66a-1342d1cf8901",
    "d435e328-424b-4435-af42-3777dd7286a3",
    "b31ecb00-f883-4f36-b03a-0901f70bd68d",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await Promise.all(
          templateIds.map(async (id) => {
            const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}/products/getOne/${id}`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );
            return response.status === 200 ? response.data : null;
          })
        );

        const validProducts = fetchedProducts.filter(
          (product) => product !== null
        );

        // Validate selected storeData products
        const selectedProducts = [storeData[0], storeData[1]]; // Updated to match your `storeData` index
        const combinedProducts = [
          ...selectedProducts.map((item, index) => ({
            ...item,
            id: `static-${index}`,
            previewUrl: item.image, // Ensure `previewUrl` is available
            title: `Static Product ${index + 1}`, // Add a title if not present
          })),
          ...validProducts,
        ];

        setProducts(combinedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goNext = () => {
    if (swiperRef.current) swiperRef.current.swiper.slideNext();
  };

  const goPrev = () => {
    if (swiperRef.current) swiperRef.current.swiper.slidePrev();
  };

  const handleShopNow = (index) => {
    window.location.href = "/store";
  };

  return (
    <>
      <div className="mt-[1rem] lg:mt-[6rem] w-full flex justify-center items-center flex-col">
        <div className="flex justify-end items-center lg:w-[79%]">
          <div className="hidden lg:flex gap-4">
            <div
              className="bg-main-ligther p-2 rounded-full flex justify-center items-center"
              onClick={goPrev}
            >
              <BiSolidLeftArrow className="cursor-pointer text-main-dark text-[22px]" />
            </div>
            <div
              className="bg-main-ligther p-2 rounded-full flex justify-center items-center"
              onClick={goNext}
            >
              <BiSolidRightArrow className="cursor-pointer text-main-dark text-[22px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center flex-col mt-8 mb-4">
        {loading ? (
          // add loading state
          <div className="flex justify-center items-center h-[200px] w-[200px]">
            <ClipLoader />
          </div>
        ) : (
          <Swiper
            ref={swiperRef}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              340: { slidesPerView: 1, spaceBetween: 15 },
              600: { slidesPerView: 2, spaceBetween: 25 },
              700: { slidesPerView: 3, spaceBetween: 25 },
            }}
            freeMode
            modules={[FreeMode, Autoplay]}
            className="w-full"
          >
            {products.map((product, index) => (
              <SwiperSlide key={index}>
                <div className="lg:w-[460px] h-[460px] relative border-2 rounded">
                  <img
                    src={product.previewUrl || product.image}
                    alt={product.title || "Product Image"}
                    className="absolute w-[100%] h-[100%] object-cover"
                  />
                  <div className="absolute top-5 left-5">
                    <button
                      className="text-white py-2 px-4 bg-main-dark rounded-md"
                      onClick={() => handleShopNow(index)}
                    >
                      Shop now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
};

export default StoreSlider;
