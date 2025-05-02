// src/components/LazyLoadComponent.js
import React, { Suspense } from "react";
import { SyncLoader } from "react-spinners";

const LazyLoadComponent = ({ component: Component }) => (
  <Suspense fallback={<SyncLoader color="#FEB7DC" />}>
    <Component />
  </Suspense>
);

export default LazyLoadComponent;
