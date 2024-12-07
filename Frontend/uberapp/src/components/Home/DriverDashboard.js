import React from 'react'
import Header from "../Common/Header/DriverHeader/Header";
import Footer from "../Common/Footer/Footer";
import Dashboard from "../DriverDashboard/Dashboard";
import RideRequest from "../DriverDashboard/RideRequest";
function DriverDashboard() {
  return (
    <>
    <Header />
    <Dashboard />
    <RideRequest />
    <Footer />
    </>
  )
}

export default DriverDashboard