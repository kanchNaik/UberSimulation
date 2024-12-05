import React from "react";
import Header from "../Common/Header/CustomerHeader/Header";
import RideForm from "../Common/Ride/RideForm";
import Map from "../Common/Map/Map";
import DropdownMenu from '../Common/Header/CustomerHeader/DropdownMenu';
function Home() {
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
        <RideForm />
        <Map />
        <DropdownMenu />
      </div>
    </>
  );
}

export default Home;
