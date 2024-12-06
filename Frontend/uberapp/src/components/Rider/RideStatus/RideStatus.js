import React, { useState, useEffect } from "react";
import "./RideStatus.css";
import Map from "../../Common/Map/Map";
import Header from "../../Common/Header/CustomerHeader/Header"; // Import the CustomerHeader
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMapPin, faStar } from "@fortawesome/free-solid-svg-icons";

const RideStatus = ({ isDriver = false }) => {
  const [showStatus, setShowStatus] = useState(true);
  const [rating, setRating] = useState(0); // State for selected rating

  const handleRating = (value) => {
    setRating(value); // Update the selected rating
  };

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
          <div className="ride-status-title">
            {isDriver ? "Juan is on trip" : "Francisco Hernandez is on the way"}
          </div>

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

          {/* Navigate and Cancel Buttons */}
          <div className="navigate-section">
          <button className="cancel-button">Cancel Ride</button>
            <button className="navigate-button">Navigate</button>
          
          </div>

          {/* Driver Info */}
          <div className="driver-info-section">
            <h1 className="driver-info-title">Driver</h1>
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

          {/* Driver Rating Section */}
          <div className="rating-section">
            <h3 className="rating-title">How was your trip with Francisco?</h3>
            <p className="rating-subtitle">Tuesday morning to 1839 Grant Ave</p>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((value) => (
                <FontAwesomeIcon
                  key={value}
                  icon={faStar}
                  className={`star-icon ${value <= rating ? "selected" : ""}`}
                  onClick={() => handleRating(value)}
                />
              ))}
            </div>
            <p className="tip-message">After rating, you can add a tip</p>
          </div>
        </div>

        {/* Right Card (Map) */}
        <div className="card map-card">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default RideStatus;
