import React from "react";
import Header from "./components/Common/Header/CustomerHeader"; // Adjust the import path as needed
import "./Trips.css";

const Trips = () => {
  return (
    <>
      <Header /> {/* Add the Header component */}
      <div className="trips-section">
        <h2 className="trips-header">Past</h2>
        <div className="trips-content">
          <div className="trips-info">
            <p>You have not taken any rides yet, take your first ride</p>
            <button className="book-now-btn">Book now</button>
          </div>
          <div className="trips-image">
            <img
              src="/path-to-car-graphic.png"
              alt="Car Graphic"
              className="car-image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Trips;
