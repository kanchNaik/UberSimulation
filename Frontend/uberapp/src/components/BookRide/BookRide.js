import React, { useState } from 'react';
import Header from '../Common/Header/CustomerHeader/Header'; // Importing reusable header
import './BookRide.css';

const locationSuggestions = [
  'San Jose State University, 1 Washington Sq, San Jose, CA',
  'San José Mineta International Airport, San Jose, CA',
  'Santa Clara University, 500 El Camino Real, Santa Clara, CA',
  'San Francisco International Airport, San Francisco, CA',
  'Corner of S 7th and E San Salvador Sts, San Jose, CA'
];

const BookRide = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('Pickup now');
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);

  const handleSearch = () => {
    console.log("Searching for a ride from", pickupLocation, "to", dropoffLocation, "at", pickupTime);
  };

  const handlePickupInputChange = (e) => {
    setPickupLocation(e.target.value);
    setShowPickupSuggestions(true);
  };

  const handleDropoffInputChange = (e) => {
    setDropoffLocation(e.target.value);
    setShowDropoffSuggestions(true);
  };

  const handleSuggestionClick = (setFunction, value) => {
    setFunction(value);
    setShowPickupSuggestions(false);
    setShowDropoffSuggestions(false);
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
            <div className="input-wrapper">
              <input
                type="text"
                value={pickupLocation}
                onChange={handlePickupInputChange}
                onFocus={() => setShowPickupSuggestions(true)}
                placeholder="Enter pickup location"
              />
              {showPickupSuggestions && (
                <div className="suggestions-dropdown">
                  {locationSuggestions
                    .filter(location => location.toLowerCase().includes(pickupLocation.toLowerCase()))
                    .map((location, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(setPickupLocation, location)}
                      >
                        <span role="img" aria-label="location">📍</span> {location}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="input-group">
            <label>Dropoff location</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={dropoffLocation}
                onChange={handleDropoffInputChange}
                onFocus={() => setShowDropoffSuggestions(true)}
                placeholder="Enter dropoff location"
              />
              {showDropoffSuggestions && (
                <div className="suggestions-dropdown">
                  {locationSuggestions
                    .filter(location => location.toLowerCase().includes(dropoffLocation.toLowerCase()))
                    .map((location, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(setDropoffLocation, location)}
                      >
                        <span role="img" aria-label="location">📍</span> {location}
                      </div>
                    ))}
                </div>
              )}
            </div>
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
