import React from "react";
import contactus from "../../assets/images/contactus (5).jpg";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { Typography } from "@material-tailwind/react";
const ContactUs = () => {
  return (
    <>
      {/* Header */}
      <div className="relative w-full flex items-center justify-center">
        <img src={contactus} alt="headerimage" className="md:h-[600px] w-full h-[280px] " />
        <p className="absolute  text-white md:text-mianheading font-bold text-[25px]">
          Contact Us
        </p>
      </div>

      <SectionWrapper
        justifyContent={"center"}
        alignItems={"center"}
        margin={"mt-[2rem]"}
        direction={"col"}
        gap={"gap-3"}
      >
        {/* map section  */}

        {/* <div className="w-full  mt-12 h-[450px]">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.4771508629606!2d0.01469647646973111!3d51.50446157181271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a811fe1ac7fd%3A0xc4c69b1db6d204db!2s60%20Dock%20Rd%2C%20London%20E16%201YZ%2C%20UK!5e0!3m2!1sen!2s!4v1713962558877!5m2!1sen!2s" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"  className="w-full h-full"></iframe>
        </div> */}
       
        {/* contact us form  */}

        <div className="w-full rounded-lg px-8 py-14 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]  mt-6">
          <Typography variant="h5">Contact Us</Typography>
          <form
            action=""
            className="w-full mt-6 flex flex-wrap justify-between gap-4"
          >
            <div className="flex flex-col md:w-[48%] w-full">
              <Typography variant="h6">First Name*</Typography>
              <input
                type="text"
                className="w-full py-2 px-3 border border-main-dark"
                placeholder="First Name"
              />
            </div>
            <div className="flex flex-col md:w-[48%] w-full">
              <Typography variant="h6">Last Name*</Typography>
              <input
                type="text"
                className="w-full py-2 px-3 border border-main-dark"
                placeholder="Last Name"
              />
            </div>
            <div className="flex flex-col md:w-[48%] w-full">
              <Typography variant="h6">Email Address*</Typography>
              <input
                type="email"
                className="w-full py-2 px-3 border border-main-dark"
                placeholder="Enter Email Address"
              />
            </div>
            <div className="flex flex-col md:w-[48%] w-full">
              <Typography variant="h6">Phone Number*</Typography>
              <input
                type="number"
                className="w-full py-2 px-3 border border-main-dark "
                placeholder="Phone Number"
              />
            </div>
            <div className="flex flex-col w-full">
              <Typography variant="h6">Message*</Typography>
              <textarea
                rows="4"
                className="w-full py-2 px-3 border border-main-dark focus:border-main-dark focus:ring-0
                 focus:outline-none focus:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
                placeholder="Message"
              />
            </div>

            <div>
              <button
                type="submit"
                className="mt-2 text-sm bg-main-dark text-white rounded-lg py-3 px-3 hover:bg-main-primary duration-300 hover:text-black"
              >
                Submit Message
              </button>
            </div>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
};

export default ContactUs;
