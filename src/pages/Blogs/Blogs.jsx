import React, { useEffect, useState } from "react";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper";
import bloghead from "../../assets/images/football-play (7).jpg";
import BlogsCard from "../../Components/Blogs/BlogsCard";
import { blogCardData } from "../../data/belogCard";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const fetchBlogs = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`${BASE_URL}/blogs`);
      setBlogs(response.data.blogs || []);
      setFetchLoading(false);
    } catch (error) {
      setFetchLoading(false);
      console.error("Error fetching blogs", error);
    }
  };
  // Fetch blogs
  useEffect(() => {
    fetchBlogs();
  }, []);
  if (fetchLoading)
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />;
      </div>
    );

  return (
    <>
      {/* Header */}
      <div className="relative w-full">
        <img
          src={bloghead}
          alt="headerimage"
          className="md:h-[600px] w-full h-[280px] object-cover"
        />
        <p className="absolute bottom-10 left-11 text-white md:text-mianheading font-bold text-[25px]">
          News
        </p>
      </div>
      <SectionWrapper
        justifyContent={"center"}
        alignItems={"center"}
        margin={"lg:mt-[4rem]"}
        direction={"col"}
        gap={"gap-3"}
      >
        {/* blog card  */}

        <div className=" w-[90%] sm:w-[70%] md:w-[100%] lg:w-[100%] flex justify-center items-center flex-wrap gap-[3rem] mt-[2.8rem]">
          {blogs?.map((item, index) => (
            <>
              <Link to={`/blogdetail/${item?._id}`} key={index}>
                <BlogsCard data={item} index={index} />
              </Link>
            </>
          ))}
        </div>
      </SectionWrapper>
      {/* <div className="w-full border border-[#C7C7C7] mt-16"></div>
    
      <div className="w-full  mt-[1.5rem] flex justify-center mb-5">
        <div className="md:w-[70%]  flex items-center justify-between flex-wrap p-2 w-full">
        <div className="  md:w-[70%] xl:w-[35%] px-3 lg:px-0 xl:ml-1 mb-1 pb-5 xl:pb-0 w-full">
            <p className="text-[20px] font-semibold text-black">Subscribe</p>
          </div>
         
          <div className="lg:w-[80%] lg:gap-8 xl:gap-0  flex flex-col lg:flex-row  items-center w-full">
         
            <div className=" w-full  xl:w-[70%] relative ">
              <input
                type="text"
                placeholder="Your email address"
                className="border w-full py-[0.6rem] px-3 rounded-3xl text-[14px] text-[#808080] focus:outline-none"
              />
              <div className="py-[0.6rem] cursor-pointer rounded-3xl absolute bg-main-dark px-7 text-white right-0 top-0 text-[15px]">
                Subscribe
              </div>
            </div>
        
            <div className="w-full lg:w-[30%] pt-5 lg:pt-0 flex justify-center items-center gap-4">
              <div className="text-white bg-main-dark p-2 rounded-full">
                <FaFacebookF />
              </div>
              <FaTwitter />
              <FaPinterestP />
              <FaInstagram />
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Blogs;
