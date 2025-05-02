import React, { useRef } from "react";
import { BiLike, BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import { sliderData } from "../../data/Home";
import { IoIosStar } from "react-icons/io";
const HomeSlider = () => {
  const swiperRef = useRef(null);

  const goNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const goPrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <>
      <div className=" mt-[1rem] lg:mt-[6rem] w-full flex justify-center items-center flex-col ">
        <div className="flex justify-center items-center ">
          <h1 className="text-secondheading text-main-dark uppercase">WHAT THEY SAY</h1>
        </div>

        <h1 className=" text-[22px] py-4 lg:py-0 lg:text-mianheading ">TESTIMONIALS</h1>
        <div className="flex justify-end items-center lg:w-[79%]">
          <div className=" hidden lg:flex gap-4 ">
            <div className="bg-main-ligther p-2 rounded-full flex justify-center items-center" onClick={goPrev}>
              <BiSolidLeftArrow className="cursor-pointer text-main-dark text-[22px]" />
            </div>
            <div className="bg-main-ligther p-2 rounded-full flex justify-center items-center" onClick={goNext}>
              <BiSolidRightArrow className="cursor-pointer text-main-dark text-[22px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center  justify-center flex-col mt-8 mb-4">
        <Swiper
          ref={swiperRef}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            340: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            600: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            700: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
          }}
          freeMode={true}
          // pagination={{
          //   clickable: true,
          // }}
          modules={[FreeMode, Autoplay]}
          className="w-full "
        >
          {sliderData.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="  lg:w-[460px] h-[310px] relative">
                <img src={item.img} alt="" className="absolute w-[85%] h-[262px] shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)] " />
                <div className="absolute bottom-[1rem] right-0 flex justify-center items-center flex-col gap-3 w-[65%] bg-white p-2 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <p className="text-[12px] font-[800]">{item.name}</p>
                      <p className="text-[10px] text-[#505050]">{item.jobTitle}</p>
                    </div>

                    <div className="flex justify-center gap-3 items-center">
                      <div className="text-white text-sm bg-[#5D5DFF] p-1 rounded-full flex justify-center items-center">
                        <BiLike />
                      </div>
                      <p className="text-[12px] font-[800]">Testimonial</p>
                    </div>
                  </div>

                  <div className="mb-10">
                    <p className="text-[14px]">
                      I would recommend Notion for anyone trying to get the word out about their business. It has saved me so much time!
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-[48px] left-10 flex justify-center items-center py-2 px-3 gap-1  bg-black">
                  {Array(5)
                    .fill()
                    .map((_, index) => (
                      <div className="flex flex-row justify-center items-center text-white " key={index}>
                        <IoIosStar />
                      </div>
                    ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default HomeSlider;
