import React, { useState, useEffect } from "react";
import "./RideStatus.css";
import Map from "../../Common/Map/Map";
import Header from "../../Common/Header/CustomerHeader/Header"; // Import the CustomerHeader
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMapPin } from "@fortawesome/free-solid-svg-icons";

const RideStatus = ({ isDriver = false }) => {
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatus(false); // Hide the confirmation message after 5 seconds
    }, 5000);
    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  return (
    <div className="ride-status-container">
      {/* Header */}
      <Header />

      {/* Green Confirmation Message */}
      {showStatus && (
        <div className="confirmation-status">
          <p>Your ride is confirmed and on its way!</p>
        </div>
      )}

      {/* Main Content */}
      <div className="ride-status-content">
        {/* Left Card (Details) */}
        <div className="card details-card">
          <h1 className="ride-status-title">
            {isDriver ? "Juan is on trip" : "Francisco Hernandez is on the way"}
          </h1>

          {/* Location Details */}
          <div className="location-details">
            <div className="location-item">
              <FontAwesomeIcon icon={faMapPin} className="location-icon" />
              <span className="location-text">Current Location</span>
            </div>
            <p className="address">123 Columbus Ave</p>
            <div className="location-item">
              <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
              <span className="location-text">Destination</span>
            </div>
            {!isDriver && <p className="destination">1839 Grant Ave</p>}
          </div>

          {/* Navigate Button */}
          <div className="navigate-section">
            <button className="navigate-button">Navigate</button>
            {!isDriver && <p className="arrival-time">9:53am</p>}
          </div>

        {/* Driver Info */}
        <div className="driver-info-section">
            <h3 className="driver-info-title">Driver</h3>
            <div className="driver-info">
                <img
                    src="https://via.placeholder.com/50"
                    alt="Driver"
                    className="driver-image"
                />
                <div className="driver-details">
                    <h4 className="driver-plate">3M53AF2</h4>
                    <p className="driver-car-details">Silver Honda Civic</p>
                    <p className="driver-rating">
                        Anderson &middot; <span className="rating">4.8 ★</span>
                    </p>
                </div>
            </div>
        </div>
        </div>
        <div className="card map-card">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default RideStatus;
