import React from 'react';
import './billing.css';

const Billing = () => {
  return (
    <div className="billing-container">
      <div className="billing-header">
        <h1>Thanks for riding Uber!</h1>
        <p>Billed to: <strong>Joe</strong></p>
        <p>Trip Request Date: <strong>August 8, 2013 at 04:50pm</strong></p>
        <p>Pickup Location: <strong>[Pickup Location]</strong></p>
        <p>Dropoff Location: <strong>[Dropoff Location]</strong></p>
        <p>Credit Card: <strong>Personal Visa</strong></p>
        <h2 className="total-amount">$24.00</h2>
      </div>

      <div className="fare-breakdown">
        <h3>Fare Breakdown</h3>
        <ul>
          <li>Base Fare: $7.00</li>
          <li>Distance: $8.64</li>
          <li>Time: $5.00</li>
          <li>Rounding Down: ($0.30)</li>
          <li>Discount Subtotal: $0.00</li>
        </ul>
        <h3>Total Fare: $24.00</h3>
        <p>Billed to Card: $24.00</p>
        <p>Outstanding Balance: $0.00</p>
      </div>

      <div className="trip-statistics">
        <h3>Trip Statistics</h3>
        <ul>
          <li>Distance: 3.34 miles</li>
          <li>Duration: 19 minutes, 46 seconds</li>
          <li>Average Speed: 10.13 mph</li>
        </ul>
      </div>

      <div className="map-container">
        <img src="/path/to/map-image.png" alt="Trip Route Map" />
      </div>
    </div>
  );
};

export default Billing;
