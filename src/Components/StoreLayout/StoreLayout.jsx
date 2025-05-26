import React from "react";
import StoreNavbar from "../StoreSection/StoreNavbar";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import StoreFooter from "../StoreSection/StoreFooter";

const StoreLayout = () => {
  return (
    <div>
      <StoreNavbar />

      <Outlet />
      {/* <StoreFooter /> */}
      <Footer />
    </div>
  );
};

export default StoreLayout;
