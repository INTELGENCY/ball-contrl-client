import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="auth-content">
    <Outlet />
  </div>
);

export default AuthLayout;
