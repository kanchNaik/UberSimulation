import React from "react";
import Header from "../../Common/Header/CustomerHeader/Header"; // Import the Header component from the correct directory
import "./TripsList.css"; // Link your custom styles here
import carIllustration from "./trips.png"; // Import the image

const TripsList = () => {
  return (
    <div className="uber-trips-page">
      {/* Use the Header component */}
      <Header />

      {/* Main content */}
      <main className="uber-main">
        {/* Upcoming Trips Section */}
        <section className="upcoming-trips">
          <h2>Upcoming</h2>
          <div className="trip-banner">
            <img
              src={carIllustration}
              alt="Car Illustration"
            />
            <div className="trip-info">
              <p>You have no upcoming trips</p>
              <button className="reserve-button">Reserve ride</button>
            </div>
          </div>
        </section>

        {/* Sidebar Section */}
        <aside className="sidebar">
          <div className="ride-promo">
            <img
              src={carIllustration}
              alt="Car Illustration"
              className="promo-image"
            />
            <h3>Get a ride in minutes</h3>
            <p>
              Book an Uber from a web browser, no app install necessary.
            </p>
            <button className="request-ride-button">Request a Ride</button>
          </div>
        </aside>

        {/* Past Trips Section */}
        <section className="past-trips">
          <h2>Past</h2>
          <h3>Dec 2</h3>
          <div className="past-trip-item">
            <div className="past-trip-map">
              {/* Placeholder for map or illustration */}
              <img
                src="https://via.placeholder.com/150"
                alt="Map Placeholder"
              />
            </div>
            <div className="past-trip-info">
              <h4>San José Mineta International Airport (SJC)</h4>
              <p>Dec 2 • 1:59 PM</p>
              <p>$0.00 • Canceled</p>
              <div className="past-trip-buttons">
                <button>Help</button>
                <button>Details</button>
                <button>Rebook</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TripsList;
