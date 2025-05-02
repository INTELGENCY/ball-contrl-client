import React from 'react';
import { Outlet } from 'react-router-dom';

const PlayerDashboardLayout = () => (
  <div className="dashboard-content">
    <Outlet />
  </div>
);

export default PlayerDashboardLayout;
