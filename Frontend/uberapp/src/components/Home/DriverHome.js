import React, { useState } from "react";
import Header from "../Common/Header/DriverHeader/Header";
import Footer from "../Common/Footer/Footer";
import Map from "../Common/Map/Map";
import AvailabilityToggle from "../DriverDashboard/AvailabilityToggle";
import RideRequest from "../DriverDashboard/RideRequest";
import Sidebar from "../DriverDashboard/DriverSidebar";

const DriverHome = () => {
  const [rideRequests, setRideRequests] = useState([
    {
      id: 1,
      riderName: "John Doe",
      pickupLocation: "123 Main St",
      dropoffLocation: "456 Elm St",
      distance: "5 miles",
      time: "10 mins",
    },
    {
      id: 2,
      riderName: "Jane Smith",
      pickupLocation: "789 Oak St",
      dropoffLocation: "321 Pine St",
      distance: "8 miles",
      time: "15 mins",
    },
  ]);

  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);

  const handleDecline = () => {
    console.log("Decline button clicked");
    if (currentRequestIndex < rideRequests.length - 1) {
      setCurrentRequestIndex(currentRequestIndex + 1);
    } else {
      console.log("No more ride requests!");
      setCurrentRequestIndex(-1); // No more requests
    }
  };

  const handleAccept = () => {
    console.log("Accept button clicked");
    alert("Ride Accepted!");
    setRideRequests([]); // Clear ride requests after acceptance
  };

  const currentRide =
    currentRequestIndex !== -1 ? rideRequests[currentRequestIndex] : null;

  return (
    <>
      <Header />

      <div style={{ padding: "20px" }}>
        <Map />
        <p>Location:</p>
        <AvailabilityToggle driverId="driver1" />
        {currentRide ? (
          <RideRequest
            {...currentRide}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ) : (
          <p style={{ textAlign: "center" }}>No more ride requests available!</p>
        )}
      </div>
      <Sidebar />
      <Footer />
    </>
  );
};

export default DriverHome;
