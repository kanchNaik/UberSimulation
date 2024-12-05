import React, { useState } from "react";
import UberHeader from "../Common/Header/UberHeader/UberHeader";
import "./UberHomeStyles.css";
import RideForm from "../Common/Ride/RideForm";
import Map from "../Common/Map/Map";
import ChooseRide from "../Rider/ChooseRide/ChooseRide";

function UberHome() {
  const [showChooseRide, setShowChooseRide] = useState(false);

  const handleSearchClick = () => {
    setShowChooseRide(true);
  };

  const handleCloseChooseRide = () => {
    setShowChooseRide(false);
  };

  return (
    <>
      <UberHeader />
      {/* Container to align RideForm and Map side-by-side */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "20px",
          gap: "20px",
        }}
      >
        <RideForm onSearch={handleSearchClick} />
        <Map />
      </div>

      {/* Render ChooseRide modal if showChooseRide is true */}
      {showChooseRide && <ChooseRide onClose={handleCloseChooseRide} />}
    </>
  );
}

export default UberHome;
