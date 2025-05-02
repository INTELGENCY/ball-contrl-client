import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import cookies_icon from "../../../assets/WebP/cookies 1.webp";

const CookiesPolicy = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="">
      <div className="relative">
        {loading ? <Skeleton height={300} /> : <img src={cookies_icon} className="w-full" alt="cookies_icon" />}
        <h1 className="absolute bottom-10 left-36 text-[50px] text-white">{loading ? <Skeleton width={250} height={50} /> : "Cookies Policy"}</h1>
      </div>
      <div className="w-[80%] mx-auto">
        <div className="flex flex-col gap-[18px]">
          {/* ----------------- */}
          {loading ? (
            <>
              <Skeleton height={30} width={400} />
              <Skeleton count={4} height={20} />
              <Skeleton count={2} height={20} />
            </>
          ) : (
            <>
              <h1 className="text-[24px] cook pt-10 uppercase text-[#FD86C8] font-semibold">Cookies and similar technologies: what are they?</h1>
              {/* --------------- */}
              <p>
                When you use our Website, we may collect certain information by automated means, such as cookies and similar technologies which may include web
                beacons or SDK. A "cookie" is a file that websites send to a visitor's computer or other Internet-connected device to uniquely identify the
                visitor's browser or to store information or settings on the device. Web beacons (also called 'pixel tags' or GIFs) are small image file
                elements placed within web pages and web-based messaging, such as newsletters and that work together with cookies to recognise visitors and how
                they interact with that content. Using these tools we can better understand which content is of interest to our visitors. An SDK is a piece of
                data code that is included in mobile applications and works in a similar way.
              </p>
              {/* ------------ */}
              <div>
                <h1 className="font-semibold cookies pb-2">Why do we use cookies and similar technologies?</h1>
                <p>
                  The information we collect in this manner enables us to better serve you when you return to our Website - for example, it can "remember" your
                  email address to save you having to enter it manually upon your return.
                </p>
                <p className="cookies">
                  We also use cookies to track responses to our marketing materials, such as emails and online advertisements. Your browser may tell you how to
                  be notified when you receive certain types of cookies or how to restrict or disable certain types of cookies. Please be aware that restricting
                  cookies may impact the functionality of this Website.
                </p>
              </div>
              {/* -------------- */}
              <p className="cookies">
                Our Website also uses marketing automation technology to collect data on visitor behavior. These cookies help us track your visits to our
                Website and enable us to create an engaging marketing experience for you. We also use these cookies to understand your interaction with the
                emails we send you, and to ensure we’re sending you relevant information; specifically, these cookies let us know whether our emails have been
                opened, and which links are clicked.
              </p>
              {/* --------------- */}
              <p className="cookies">
                Our Website may also feature cookies associated with certain unaffiliated companies. For example, we partner with other companies to provide you
                with connections to certain social networks, such as LinkedIn and Twitter, and to provide you with additional features such as YouTube.
              </p>
              {/* --------- */}
              <div>
                <p className="cookies">
                  This Website may link through to third party websites which may also use cookies over which we have no control. We recommend that you check
                  the relevant third parties privacy policy for information about any cookies that may be used
                </p>
                <p className="cookies">
                  By engaging with such other companies’ sites, such companies may place session or persistent cookies on your device. This may allow these
                  third-parties to collect information about your online activities over time and across websites.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;
