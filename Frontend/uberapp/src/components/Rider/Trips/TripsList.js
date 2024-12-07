import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Header from "../../Common/Header/CustomerHeader/Header"; 
import "./TripsList.css"; // Link your custom styles
import carIllustration from "./trips.png"; // Import the image
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";


const TripsList = () => {
  const [personalDropdown, setPersonalDropdown] = useState(false);
  const [tripDropdown, setTripDropdown] = useState(false);
  const [personalFilter, setPersonalFilter] = useState("Personal");
  const [tripFilter, setTripFilter] = useState("All Trips");

  const navigate = useNavigate(); // Initialize useNavigate

  const handlePersonalSelect = (filter) => {
    setPersonalFilter(filter);
    setPersonalDropdown(false);
  };

  const handleTripSelect = (filter) => {
    setTripFilter(filter);
    setTripDropdown(false);
  };

  return (
    <div className="uber-trips-page">
      {/* Header */}
      <Header />

      <main className="uber-main">
        <div className="trips-content">
          {/* Upcoming Trips Section */}
          <section className="upcoming-trips">
            <h2>Upcoming</h2>
            <div className="trip-banner">
              <img src={carIllustration} alt="Car Illustration" />
            </div>
            <h2>You have no upcoming trips</h2>
            <button
              className="request-ride-button"
              onClick={() => navigate("/customer/home")} // Route to customer home
            >
              Reserve ride
            </button>
          </section>

          {/* Past Trips Section */}
          <section className="past-trips">
            <h2>Past</h2>
            <div className="trip-filters">
              {/* Personal Filter */}
              <div className="filter-dropdown">
                <button
                  className="filter-button"
                  onClick={() => setPersonalDropdown(!personalDropdown)}
                >
                  <FontAwesomeIcon icon={faUser} /> {personalFilter} ▾
                </button>
                {personalDropdown && (
                  <div className="dropdown-menu">
                    <div onClick={() => handlePersonalSelect("Personal")}>
                      Personal
                    </div>
                    <div onClick={() => handlePersonalSelect("Business")}>
                      Business
                    </div>
                    <div onClick={() => handlePersonalSelect("Family")}>
                      Family
                    </div>
                  </div>
                )}
              </div>

              {/* Trip Filter */}
              <div className="filter-dropdown">
                <button
                  className="filter-button"
                  onClick={() => setTripDropdown(!tripDropdown)}
                >
                  <FontAwesomeIcon icon={faCalendar} className="location-icon" />{" "}
                  {tripFilter} ▾
                </button>
                {tripDropdown && (
                  <div className="dropdown-menu scrollable-dropdown">
                    {[
                      "All Trips",
                      "Past 30 days",
                      "December",
                      "November",
                      "October",
                      "September",
                      "August",
                      "July",
                      "June",
                      "May",
                      "April",
                      "March",
                      "February",
                      "January",
                    ].map((month) => (
                      <div
                        key={month}
                        onClick={() => handleTripSelect(month)}
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <h3>Dec 2</h3>
            <div className="past-trip-item">
              <div className="past-trip-map">
                <img src="https://via.placeholder.com/150" alt="Map Placeholder" />
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
        </div>

        {/* Sidebar Section */}
        <div className="ride-promo">
          <img src={carIllustration} alt="Car Illustration" className="promo-image" />
          <h3>Get a ride in minutes</h3>
          <p>Book an Uber from a web browser, no app install necessary.</p>
          <button
            className="request-ride-button"
            onClick={() => navigate("/customer/home")} // Route to customer home
          >
            Request a Ride
          </button>
        </div>
      </main>
    </div>
  );
};

export default TripsList;
