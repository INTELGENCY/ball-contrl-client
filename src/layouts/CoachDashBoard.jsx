import React from 'react';
import { Outlet } from 'react-router-dom';

const CoachDashBoardLayout = () => (
  <div className="dashboard-content">
    <Outlet />
  </div>
);

export default CoachDashBoardLayout;
