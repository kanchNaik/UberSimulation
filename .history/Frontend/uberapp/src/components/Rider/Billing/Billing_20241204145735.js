import React from 'react';
import './billing.css';

const Billing = () => {
  return (
    <div className="billing-container">
      <div className="header">
        <h2>Thanks for riding Uber!</h2>
        <p><strong>Billed to:</strong> Joe</p>
        <p><strong>Trip Request Date:</strong> August 6, 2013 at 04:50pm</p>
        <p><strong>Pickup Location:</strong> [Your Pickup Location]</p>
        <p><strong>Dropoff Location:</strong> [Your Dropoff Location]</p>
        <p><strong>Credit Card:</strong> Personal Visa</p>
        <h3>Billed to Card: $24.00</h3>
      </div>

      <div className="billing-details">
        <div className="driver-map-info">
          <div className="driver-info">
            <img src="driver-placeholder.jpg" alt="Driver" className="driver-image" />
            <p>Driver: Mostafa</p>
          </div>
          <div className="map">
            <img src="map-placeholder.jpg" alt="Trip Map" />
          </div>
        </div>

        <div className="fare-breakdown">
          <h3>Fare Breakdown</h3>
          <table>
            <tbody>
              <tr>
                <td>Base Fare</td>
                <td>$7.00</td>
              </tr>
              <tr>
                <td>Distance</td>
                <td>$8.04</td>
              </tr>
              <tr>
                <td>Time</td>
                <td>$5.00</td>
              </tr>
              <tr>
                <td>Rounding Down</td>
                <td>($0.30)</td>
              </tr>
              <tr>
                <td>Discount Subtotal</td>
                <td>($0.30)</td>
              </tr>
              <tr className="total">
                <td>Total Fare</td>
                <td>$24.00</td>
              </tr>
              <tr>
                <td>Billed to Card</td>
                <td>$24.00</td>
              </tr>
              <tr>
                <td>Outstanding Balance</td>
                <td>$0.00</td>
              </tr>
            </tbody>
          </table>
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
