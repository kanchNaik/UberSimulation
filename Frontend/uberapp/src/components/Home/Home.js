import React, { useState } from "react";
import Header from "../Common/Header/CustomerHeader/Header";
import RideForm from "../Common/Ride/RideForm";
import Map from "../Common/Map/Map";
import ChooseRide from "../Rider/ChooseRide/ChooseRide";

function Home() {
  const [showChooseRide, setShowChooseRide] = useState(false);

  const handleSearchClick = () => {
    setShowChooseRide(true);
  };

  const handleCloseChooseRide = () => {
    setShowChooseRide(false);
  };

  return (
    <>
      <Header />
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
        <div className="card map-card">
          <Map />
        </div>
      </div>

      {/* Render ChooseRide modal if showChooseRide is true */}
      {showChooseRide && <ChooseRide onClose={handleCloseChooseRide} />}
    </>
  );
}

export default Home;
