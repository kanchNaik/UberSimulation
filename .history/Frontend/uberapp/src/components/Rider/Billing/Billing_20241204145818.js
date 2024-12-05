import React from 'react';
import './Billing.css';

const Billing = () => {
  return (
    <div className="billing-container">
      <h2>Thanks for riding Uber!</h2>
      <div className="billing-details">
        <div className="trip-info">
          <div className="driver-info">
            <img src="driver-placeholder.jpg" alt="Driver" className="driver-image" />
            <p>Driver: Sammy Spartan</p>
          </div>
          <div className="map">
            <img src="map-placeholder.jpg" alt="Trip Map" />
          </div>
          <div className="trip-summary">
            <p><strong>Trip Request Date:</strong> August 6, 2013 at 04:50pm</p>
            <p><strong>Pickup Location:</strong> [Your Pickup Location]</p>
            <p><strong>Dropoff Location:</strong> [Your Dropoff Location]</p>
            <p><strong>Billed to:</strong> <span>Personal Visa</span></p>
            <h3>Billed to Card: $24.00</h3>
          </div>
        </div>

        <div className="fare-breakdown">
          <h3>Fare Breakdown</h3>
          <p>Base Fare: <span>$7.00</span></p>
          <p>Distance: <span>$8.04</span></p>
          <p>Time: <span>$5.00</span></p>
          <p>Rounding Down: <span>($0.30)</span></p>
          <hr />
          <p><strong>Total Fare:</strong> <span>$24.00</span></p>
        </div>

        <div className="trip-statistics">
          <h3>Trip Statistics</h3>
          <p>Distance: <span>3.34 miles</span></p>
          <p>Duration: <span>19 minutes, 46 seconds</span></p>
          <p>Average Speed: <span>10.13 mph</span></p>
        </div>
      </div>
    </div>
  );
};

export default Billing;
