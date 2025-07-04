import React, { Suspense, lazy, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import ChatBotAgent from "./ChatBotAgent";
import { useSelect } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { checkAlreadySubscribeApi } from "../../services/AuthApis";

// Lazy load components
const Banner = lazy(() => import("../../Components/Banner/Banner"));
const Teacher = lazy(() => import("../../Components/Teacher/Teacher"));
const StatsBanner = lazy(() => import("../../Components/Banner/StatsBanner"));
const Promo = lazy(() => import("../../Components/Banner/Promo"));
const BecomeCoach = lazy(() =>
  import("../../Components/HomeButtons/BecomeCoach")
);
const StoreSlider = lazy(() =>
  import("../../Components/HomeSlider/StoreSlider")
);
const Partner = lazy(() => import("../../Components/BannerPartner/Partner"));
const Coaches = lazy(() => import("../../Components/Coaches/Coaches"));
const EmailPopup = lazy(() => import("../../Components/EmailPopUp/EmailPopup"));
// const FAQ = lazy(() => import("../../Components/Faq/Faq"));

const Home = () => {
  const [checkState, setCheckState] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  useEffect(() => {
    try {
      setCheckState(true);
      const checkAlreadySubscribe = async () => {
        const data = await checkAlreadySubscribeApi(currentUser?.email);
        setCheckState(false);
      };
      if (currentUser) {
        checkAlreadySubscribe();
      }
    } catch (error) {
      setCheckState(true);
      console.log("Error while getting data", error);
    }
  }, [currentUser]);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color="#FEB7DC" size={45} />
        </div>
      }
    >
      <div>
        <Banner />
        <Partner />
        <Coaches />
        <StatsBanner />
        <StoreSlider />
        <Promo />
        <BecomeCoach />
        <Teacher />
        {!checkState && currentUser.role !== "admin" && <EmailPopup />}

        <ChatBotAgent />
      </div>
    </Suspense>
  );
};

export default Home;
