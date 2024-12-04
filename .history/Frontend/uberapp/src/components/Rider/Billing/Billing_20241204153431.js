import React, { useState } from 'react';
import Header from '../../Common/Header/CustomerHeader/Header'; // Importing reusable header
import './Billing.css'; // Billing styles
// import mapPlaceholder from './map-placeholder.jpg'; // Map image placeholder
// import driverPlaceholder from './driver-placeholder.jpg'; // Driver image placeholder

const Billing = () => {
  const [tripDropdown, setTripDropdown] = useState(false);
  const [tripFilter, setTripFilter] = useState('All Trips');

  const handleTripSelect = (filter) => {
    setTripFilter(filter);
    setTripDropdown(false);
  };

  return (
    <div className="billing-page">
      <Header /> {/* Reusable Header component */}
      
      <main className="billing-container">
        <div className="header">
          <h2>Thanks for riding Uber!</h2>
          <p><strong>Billed to:</strong> Joe</p>
          <p><strong>Trip Request Date:</strong> December 6, 2024 at 04:50pm</p>
          <p><strong>Pickup Location:</strong> [Your Pickup Location]</p>
          <p><strong>Dropoff Location:</strong> [Your Dropoff Location]</p>
          <p><strong>Credit Card:</strong> Personal Visa</p>
          <h3>Billed to Card: $24.00</h3>
        </div>

        <div className="billing-details">
          <div className="trip-info">
            <div className="driver-info">
              {/* <img src={driverPlaceholder} alt="Driver" className="driver-image" /> */}
              <p>Driver: Sammy Spartan</p>
            </div>
            <div className="map">
              {/* <img src={mapPlaceholder} alt="Trip Map" /> */}
            </div>
            <div className="trip-summary">
              <p><strong>Trip Request Date:</strong> December 6, 2024 at 04:50pm</p>
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

        <div className="trip-filter-section">
          <h3>Past Trips</h3>
          <div className="filter-dropdown">
            <button
              className="filter-button"
              onClick={() => setTripDropdown(!tripDropdown)}
            >
              📅 {tripFilter} ▾
            </button>
            {tripDropdown && (
              <div className="dropdown-menu scrollable-dropdown">
                <div onClick={() => handleTripSelect('All Trips')}>All Trips</div>
                <div onClick={() => handleTripSelect('Past 30 days')}>Past 30 days</div>
                <div onClick={() => handleTripSelect('December')}>December</div>
                <div onClick={() => handleTripSelect('November')}>November</div>
                <div onClick={() => handleTripSelect('October')}>October</div>
                <div onClick={() => handleTripSelect('September')}>September</div>
                <div onClick={() => handleTripSelect('August')}>August</div>
                <div onClick={() => handleTripSelect('July')}>July</div>
                <div onClick={() => handleTripSelect('June')}>June</div>
                <div onClick={() => handleTripSelect('May')}>May</div>
                <div onClick={() => handleTripSelect('April')}>April</div>
                <div onClick={() => handleTripSelect('March')}>March</div>
                <div onClick={() => handleTripSelect('February')}>February</div>
                <div onClick={() => handleTripSelect('January')}>January</div>
                {/* Add more months as needed */}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;
