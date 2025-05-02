import React from 'react';
import { Outlet } from 'react-router-dom';

const ParentDashboardLayout = () => (
  <div className="dashboard-content">
    <Outlet />
  </div>
);

export default ParentDashboardLayout;
