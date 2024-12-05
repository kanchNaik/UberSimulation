import React from "react";
import "./ConfirmRequest.css";

const ConfirmRequest = ({ onClose }) => {
  return (
    <div className="confirm-request-wrapper">
      <div className="confirm-request-overlay" onClick={onClose}></div>
      <div className="confirm-request-modal">
        <div className="ride-details">
          <img
            className="car-image"
            src="./uberx.jpg" // Replace with the correct path to your car image
            alt="UberX"
          />
          <div className="ride-info">
            <h3>UberX</h3>
            <p>13:39 • 2 min away</p>
            <p>Affordable everyday trips</p>
          </div>
          <div className="price">
            <h3>$16.42</h3>
          </div>
        </div>
        <div className="payment-method">
          <p>Apple Pay</p>
        </div>
        <button className="confirm-uber-button">Confirm UberX</button>
        <div className="confirm-notes">
          <p>Your previous fare has expired due to the elapsed time.</p>
        </div>
        <div className="confirm-request-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button">Confirm and request</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRequest;
