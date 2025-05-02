import React, { useState, useEffect } from "react";
import SectionWrapper from "../Wrapper/SectionWrapper";
import { Link } from "react-router-dom";
import { GoCheckCircleFill } from "react-icons/go";
import profit from "../../assets/images/jeffrey-f.jpg";
import test from "../../assets/png/size.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an API call or some loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="relative w-full flex items-center justify-center">
        {loading ? (
          <Skeleton height={600} width="100%" />
        ) : (
          <img
            src={test}
            alt="headerImage"
            className="md:h-[600px] w-full h-[280px] object-cover"
          />
        )}
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white md:text-5xl font-bold">
          {loading ? <Skeleton width={200} /> : "About Us"}
        </p>
      </div>

      <SectionWrapper
        justifyContent={"center"}
        alignItems={"center"}
        margin={"lg:mt-[6rem]"}
        width={"85%"}
      >
        <div className="w-full flex flex-wrap justify-center items-center xl:gap-16 xl:flex-row xl:flex-nowrap mt-5">
          {/* img div */}
          <div className="lg:w-[60%] border w-full hidden md:block">
            {loading ? (
              <Skeleton height={500} width={"100%"} className="w-full" />
            ) : (
              <img
                src={profit}
                alt="profit"
                className="w-full md:h-[500px] h-[400px]"
              />
            )}
          </div>

          {/* content div */}
          <div className="flex flex-col gap-4 lg:items-start lg:px-0 xl:justify-start lg:w-[50%] w-full">
            {loading ? (
              <>
                <Skeleton count={2} width={"100%"} />
                <Skeleton height={20} width={"90%"} />
                <Skeleton height={20} width={"80%"} />
                <Skeleton height={20} width={"70%"} />
              </>
            ) : (
              <>
                <h1 className="text-[15px] md:text-[25px] font-semibold">
                  We are about inspiring positive change to create a sustainable
                  future for women's and girls football in England.
                </h1>
                <p>
                  Women’s football is experiencing astronomical growth, both
                  from a playing and spectating perspective. Audiences are
                  growing, more girls (and even women) are kicking a ball
                  around, and it looks like records will be broken for the
                  season for the WSL.
                </p>
                {/* Back to Home link */}
                <Link
                  to="/"
                  className="bg-main-dark text-center w-9/12 mx-auto lg:w-full xl:mx-0 py-3 xl:px-4 text-white hover:bg-main-darker duration-200 rounded-lg"
                >
                  Back to Home
                </Link>
              </>
            )}
          </div>
        </div>
      </SectionWrapper>

      <div className="w-full flex justify-center">
        {/* Bullet points */}
        <div className="mt-4 md:w-[85%] w-full">
          {loading ? (
            <>
              <Skeleton width={"50%"} height={30} />
              <ul className="pl-6 flex flex-col gap-2">
                <Skeleton count={4} height={20} width={"80%"} />
              </ul>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-semibold mb-2">Our Mission:</h2>
              <ul className="pl-6 flex flex-col gap-2">
                <li className="flex items-center">
                  <GoCheckCircleFill className="text-main-dark mr-2 text-[20px]" />
                  To drive the healthy, long-term, economically-sound, global
                  growth of women's and girls football on all levels.
                </li>
                <li className="flex items-center">
                  <GoCheckCircleFill className="text-main-dark mr-2 text-[20px]" />
                  To use the unique beauty and power of the women's and girl's
                  game to change lives everywhere for the better.
                </li>
                <li className="flex items-center">
                  <GoCheckCircleFill className="text-main-dark mr-2 text-[20px]" />
                  To invest in Women's and Girl's football and build on the
                  ever-increasing growth to bolster interest and give a platform
                  for coaches and players.
                </li>
                <li className="flex items-center">
                  <GoCheckCircleFill className="text-main-dark mr-2 text-[20px]" />
                  To promote healthy wellbeing, social inclusion, and a healthy
                  lifestyle through football.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AboutPage;
