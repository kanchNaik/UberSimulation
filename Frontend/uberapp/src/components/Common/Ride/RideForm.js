import React, { useState } from "react";
import "./RideFormStyles.css";

const RideForm = ({ onSearch }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [timeOption, setTimeOption] = useState("Pickup now");

  // Example location options
  const locations = [
    "Downtown",
    "Airport",
    "University",
    "Mall",
    "Central Park",
  ];

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    onSearch({ pickup, dropoff, timeOption }); // Trigger the parent `onSearch` function
  };

  return (
    <div className="ride-form-container">
      <h3 className="ride-form-title">Get a ride</h3>
      <form className="ride-form" onSubmit={handleSearch}>
        {/* Pickup Dropdown */}
        <select
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          required
        >
          <option value="" disabled>
            Select pickup location
          </option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        {/* Dropoff Dropdown */}
        <select
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
          required
        >
          <option value="" disabled>
            Select dropoff location
          </option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        {/* Time Option Dropdown */}
        <select
          value={timeOption}
          onChange={(e) => setTimeOption(e.target.value)}
        >
          <option>Pickup now</option>
          <option>Schedule for later</option>
        </select>

        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default RideForm;
