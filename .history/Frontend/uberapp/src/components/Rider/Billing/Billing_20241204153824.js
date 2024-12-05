import React, { useState } from 'react';
import Header from '../../Common/Header/CustomerHeader/Header'; // Importing reusable header
import './Billing.css'; // Billing styles
import mapPlaceholder from './map-placeholder.jpg'; // Map image placeholder
import driverPlaceholder from './driver-placeholder.jpg'; // Driver image placeholder

const Billing = () => {
  return (
    <div className="billing-page">
      <Header />

      <main className="billing-container">
        <div className="header-content">
          <h2>Thanks for riding Uber!</h2>
          <div className="billing-overview">
            <div className="overview-item">
              <p><strong>Billed to:</strong> Joe</p>
            </div>
            <div className="overview-item">
              <p><strong>Trip Request Date:</strong> December 6, 2024 at 04:50pm</p>
            </div>
            <div className="overview-item">
              <p><strong>Pickup Location:</strong> [Your Pickup Location]</p>
            </div>
            <div className="overview-item">
              <p><strong>Dropoff Location:</strong> [Your Dropoff Location]</p>
            </div>
            <div className="overview-item">
              <p><strong>Credit Card:</strong> Personal Visa</p>
            </div>
            <div className="overview-item billed-amount">
              <p><strong>Billed to Card:</strong> <span>$24.00</span></p>
            </div>
          </div>
        </div>

        <div className="billing-details">
          <div className="trip-info">
            <div className="driver-info">
              <img src={driverPlaceholder} alt="Driver" className="driver-image" />
              <p>Driver: Sammy Spartan</p>
            </div>
            <div className="map">
              <img src={mapPlaceholder} alt="Trip Map" />
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
      </main>
    </div>
  );
};

export default Billing;
