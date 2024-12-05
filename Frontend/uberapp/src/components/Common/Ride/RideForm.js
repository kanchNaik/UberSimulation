import React, { useState } from "react";
import "./RideFormStyles.css";

const RideForm = ({ onSearch }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [timeOption, setTimeOption] = useState("Pickup now");

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    onSearch(); // Trigger the parent `onSearch` function
  };

  return (
    <div className="ride-form-container">
      <h3 className="ride-form-title">Get a ride</h3>
      <form className="ride-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dropoff location"
          value={dropoff}
          onChange={(e) => setDropoff(e.target.value)}
        />
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
