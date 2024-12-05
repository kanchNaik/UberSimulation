import React from "react";
import "./TripsList.css"; // Link your custom styles here

const TripsList = () => {
  return (
    <div className="uber-trips-page">
      <header className="uber-header">
        <div className="header-left">
          <h1>Uber</h1>
          <nav>
            <a href="#ride">Ride</a>
            <a href="#rent">Rent</a>
            <a href="#package">Package</a>
          </nav>
        </div>
        <div className="user-options">
          <span>My trips</span>
          <img
            src="profile-icon.png" // Replace with the actual icon/image
            alt="Profile"
          />
        </div>
      </header>

      <main className="uber-main">
        <section className="past-trips">
          <h2>Past</h2>
          <div className="trip-banner">
            <img
              src="Frontend/uberapp/src/components/Rider/Trips/trips.png" // Replace with the actual illustration
              alt="Car Illustration"
            />
            <div className="trip-info">
              <p>You have no upcoming trips.</p>
              <button className="booknow-button">Reserve Ride</button>
            </div>
          </div>
        </section>

        <aside className="sidebar">
          <div className="ride-promo">
            <h3>Get a ride in minutes</h3>
            <p>
              Book an Uber from a web browser, no app install necessary.
            </p>
            <button className="request-ride-button">Request a Ride</button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default TripsList;
