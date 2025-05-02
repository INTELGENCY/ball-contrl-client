import React, { useState, useEffect } from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import arrow_icon from "../../assets/Store/breadcrum_arrow.png";

const BreadCrums = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="shadow-sm flex lato-font items-center gap-[9px] pl-[20px] md:pl-[55px] lg:pl-10 xl:pl-2 h-[50px]">
      {loading ? (
        <Skeleton width={50} />
      ) : (
        <>
          Home <img src={arrow_icon} />
        </>
      )}
      {loading ? (
        <Skeleton width={50} />
      ) : (
        <>
          <span> Store</span> <img src={arrow_icon} />
        </>
      )}
      {loading ? (
        <Skeleton width={50} />
      ) : (
        <>
          <span className="capitalize">{props.category}</span> <img src={arrow_icon} />
        </>
      )}
      {loading ? (
        <Skeleton width={50} />
      ) : (
        <>
          <span className="capitalize">{props.name}</span>
        </>
      )}
    </div>
  );
};

export default BreadCrums;
