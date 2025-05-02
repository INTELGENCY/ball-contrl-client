import React from "react";
import logo from "../../assets/images/logo.svg";
import { Link } from "react-router-dom";
import { FaAngleRight, FaFacebook } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import paypal from "../../assets/Store/cart_image.png"

const useLink = [
  { name: "Home", link: "" },
  { name: "About Us", link: "about-us" },
  { name: "Coaches", link: "coaches" },
  { name: "Store", link: "store" },
  { name: "Agency", link: "agency" },
];

const policyLinks = [
  {
    name: "Safeguarding Policy ",
    link: "safeguard",
  },
  {
    name: "Equality Policy",
    link: "equality",
  },
  {
    name: "Cookies Policy ",
    link: "cookies",
  },
];

const icons = [
  { icon: FaFacebook, link: "#" },
  { icon: IoLogoInstagram, link: "#" },
];

const StoreFooter = () => {
  return (
    <>
      {/* mt-10 */}
      <div className="bg-[#c4c4c4] py-12 ">
        <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between xl:px-4 justify-start items-start">
          <div className="lg:w-1/4 flex flex-col items-center lg:items-start">
            <img src={logo} alt="logo" className="w-32 mb-4 lg:mb-0" />
            <p className="text-center lg:text-left text-sm text-white mt-2">
              Welcome to our vibrant community where passion for football meets innovation. Join us in exploring the latest trends, techniques, and stories that
              shape the beautiful game.
            </p>
          </div>
          {/* ------useful links----------------- */}
          <div className="mt-8 lg:mt-0">
            <h1 className="text-gray-100 text-xl font-bold mb-4">Useful Links</h1>
            <div className="font-semibold">
              {useLink.map((link, index) => (
                <Link key={index} to={link.link} className="flex text-white flex-col gap-3 py-2 hover:text-[#7d7d7d] duration-300 items-start">
                  <p className="flex justify-center items-center gap-2 transform hover:translate-x-2 transition-transform duration-200">
                    <FaAngleRight />
                    {link.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          {/* --------- Policy-------------- */}
          <div className="mt-8 lg:mt-0">
            <h1 className="text-gray-100 text-xl font-bold mb-4">Policy</h1>
            <div className="font-semibold">
              {policyLinks.map((link, index) => (
                <Link key={index} to={link.link} className="flex text-white flex-col gap-3 py-2 hover:text-[#7d7d7d] duration-300 items-start">
                  <p className="flex justify-center items-center gap-2 transform hover:translate-x-2 transition-transform duration-200">
                    <FaAngleRight />
                    {link.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          {/* ----------contact us ------------------ */}
          <div className="mt-8 lg:mt-0 flex items-center flex-col gap-3">
            <Link className="text-gray-100 text-xl font-bold mb-4" to={"/contact-us"}>
              Contact Us
                      </Link>
                      

            <div className="flex gap-2">
              {icons.map((icon, index) => (
                <Link
                  key={index}
                  to={icon.link}
                  className="flex items-center justify-center rounded-full bg-main-ligther text-main-dark w-10 h-10 hover:scale-125 transition-transform duration-200"
                >
                  <icon.icon className="text-main-darker text-[18px]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-6 text-center text-sm text-white">
        <div className="container mx-auto">© 2024 YourWebsite. All rights reserved.</div>
      </div>
    </>
  );
};

export default StoreFooter;
