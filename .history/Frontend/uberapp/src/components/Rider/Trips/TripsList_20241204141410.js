import React from "react";
import Header from "./Header"; // Import the Header component
import "./TripsList.css"; // Link your custom styles here
/*************  ✨ Codeium Command ⭐  *************/
/**
 * TripsList component
 *
 * This component renders the main page of the user's trips.
 * It renders a header with a navigation bar and a profile icon.
 * It also renders a main section with a past trips section and a sidebar.
 * The past trips section displays a banner with a car illustration and a button to reserve a ride.
 * The sidebar displays a promo section with a button to request a ride.
 *
 * @returns {JSX.Element} The TripsList component.
 */
/******  4d9aef94-626c-44b6-a030-11fd76ed434a  *******/
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
