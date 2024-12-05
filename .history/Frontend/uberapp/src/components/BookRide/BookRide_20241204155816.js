import React, { useState } from 'react';
import
import './BookRide.css';

const BookRide = () => {
  const [pickupLocation, setPickupLocation] = useState('San Jose State University');
  const [dropoffLocation, setDropoffLocation] = useState('San José Mineta International Airport');
  const [pickupTime, setPickupTime] = useState('Pickup now');

  const handleSearch = () => {
    console.log("Searching for a ride from", pickupLocation, "to", dropoffLocation, "at", pickupTime);
  };

  return (
    <div className="book-ride-page">
      {/* Using the Header component */}
      <Header />

      <div className="main-content">
        <div className="ride-selection">
          <h3>Get a ride</h3>
          <div className="input-group">
            <label>Pickup location</label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Enter pickup location"
            />
          </div>
          <div className="input-group">
            <label>Dropoff location</label>
            <input
              type="text"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              placeholder="Enter dropoff location"
            />
          </div>
          <div className="input-group">
            <label>Pickup time</label>
            <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)}>
              <option value="Pickup now">Pickup now</option>
              <option value="Schedule for later">Schedule for later</option>
            </select>
          </div>
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="map-container">
          <img
            src="https://via.placeholder.com/800x600?text=Map+Placeholder"
            alt="Map Placeholder"
            className="map-placeholder"
          />
        </div>
      </div>
    </div>
  );
};

export default BookRide;
