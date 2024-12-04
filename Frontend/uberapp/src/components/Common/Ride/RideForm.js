import React from "react";
import "./RideFormStyles.css";

const RideForm = () => {
  return (
    <div className="ride-form-container">
      <h3 className="ride-form-title">Get a ride</h3>
      <form className="ride-form">
        <input type="text" placeholder="Pickup location" />
        <input type="text" placeholder="Dropoff location" />
        <select>
          <option>Pickup now</option>
          <option>Schedule for later</option>
        </select>
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default RideForm;
