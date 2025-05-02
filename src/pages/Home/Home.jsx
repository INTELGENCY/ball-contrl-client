import React, { Suspense, lazy } from "react";
import { ClipLoader } from "react-spinners";

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
        <EmailPopup />
      </div>
    </Suspense>
  );
};

export default Home;
