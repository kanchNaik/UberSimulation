import React from "react";
import Header from "./Header"; // Import the Header component
import "./TripsList.css"; // Link your custom styles here

import carIllustration from "./trips.png"; // Import the image

const TripsList = () => {
  return (
    <div className="uber-trips-page">
      {/* Use the Header component */}
      <Header />

      {/* Main content */}
      <main className="uber-main">
        <section className="past-trips">
          <h2>Past</h2>
          <div className="trip-banner">
            <img
              src={carIllustration} // Use the imported image here
              alt="Car Illustration"
            />
            <div className="trip-info">
              <p>You have not taken any rides yet, take your first ride</p>
              <button className="booknow-button">Book now</button>
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
