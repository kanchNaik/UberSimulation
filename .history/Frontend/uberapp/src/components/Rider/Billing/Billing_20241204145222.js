// Billing.js
import React from "react";
import "./Billing.css"; // Link to the CSS for Billing Modal

const Billing = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="billing-modal">
      <div className="billing-modal-content">
        <button className="close-modal-button" onClick={onClose}>
          ✖
        </button>
        <h3>Price Breakdown</h3>
        <div className="bill-details">
          <div className="fare-breakdown">
            <h4>Fare Breakdown</h4>
            <p>Base Fare: $7.00</p>
            <p>Distance: $8.04</p>
            <p>Time: $5.00</p>
            <p>Rounding Down: -$0.50</p>
            <p>Discount Subtotal: -$0.50</p>
            <h4>Total Fare: $24.00</h4>
          </div>
          <div className="trip-statistics">
            <h4>Trip Statistics</h4>
            <p>Distance: 3.34 miles</p>
            <p>Duration: 19 minutes, 46 seconds</p>
            <p>Average Speed: 10.13 mph</p>
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Billing;
