import { useState, useEffect, useContext } from 'react'
import { Route, Outlet, Navigate } from 'react-router-dom'
import { AUTHCONTEXT } from '../context/AuthProvider';
import DashboardLayout from '../Layout/DashboardLayout';

function ProtectedRoutes({children, ...rest}) {
    const token = localStorage.getItem("token");
    useEffect(() => {
      return () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, [])

  return (
    token ? 
    <DashboardLayout>
      <Outlet/>
    </DashboardLayout>
      :
      <Navigate to="/signin"/>
  );
}

export default ProtectedRoutes;