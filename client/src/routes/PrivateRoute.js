import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar/index';

const PrivateRoute = ({ children, abc, ...rest }) => {
  const role = localStorage.getItem('role');
  const isLogin = localStorage.getItem('token');

  if (!role) {
    return <Navigate to='/' />
  };
  return (
    <div>
      <Navbar role={role} isLogin={isLogin} />
      <Outlet />
    </div>
  );
};

export default PrivateRoute;