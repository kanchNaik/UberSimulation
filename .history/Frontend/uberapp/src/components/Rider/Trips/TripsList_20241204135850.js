import React from "react";
import "./TripsList.css"; // Link your custom styles here

const TripsList = () => {
  return (
    <div className="uber-trips-page">
      {/* Header Section */}
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
            src="profile-icon.png" // Replace with actual icon/image path
            alt="User Profile"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="uber-main">
        {/* Past Trips Section */}
        <section className="past-trips">
          <h2>Past</h2>
          <div className="trip-banner">
            <img
              src="car-illustration.png" // Replace with actual illustration path
              alt="Car Illustration"
              className="trip-banner-image"
            />
            <div className="trip-info">
              <p>You have not taken any rides yet, take your first ride.</p>
              <button className="booknow-button">Book now</button>
            </div>
          </div>
        </section>

        {/* Sidebar Section */}
        <aside className="sidebar">
          <div className="ride-promo">
            <h3>Get a ride in minutes</h3>
            <p>Book an Uber from a web browser, no app install necessary.</p>
            <button className="request-ride-button">Request a Ride</button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default TripsList;
