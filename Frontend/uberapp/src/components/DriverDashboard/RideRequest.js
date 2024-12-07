import React from "react";
import "./RideRequest.css";

const RideRequest = ({ riderName, pickupLocation, dropoffLocation, distance, time, onAccept, onDecline }) => {
  return (
    <div className="ride-request-container">
      <div className="ride-details">
        <h2>Ride Request</h2>
        <p><strong>Rider:</strong> {riderName}</p>
        <p><strong>Pickup:</strong> {pickupLocation}</p>
        <p><strong>Dropoff:</strong> {dropoffLocation}</p>
        <p><strong>Distance:</strong> {distance}</p>
        <p><strong>Estimated Time:</strong> {time}</p>
      </div>
      <div className="action-buttons">
        <button className="accept-button" onClick={onAccept}>
          Accept Ride
        </button>
        <button className="decline-button" onClick={onDecline}>
          Decline Ride
        </button>
      </div>
    </div>
  );
};

export default RideRequest;
