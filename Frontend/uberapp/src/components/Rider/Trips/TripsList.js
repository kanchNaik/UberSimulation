import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Common/Header/CustomerHeader/Header";
import "./TripsList.css";
import carIllustration from "./trips.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { BASE_API_URL } from "../../../Setupconstants";
import Cookies from 'js-cookie';
import TripDetails from "./TripDetails";
import Modal from "../../Common/Modal/Modal";

const TripsList = () => {
  const [tripDropdown, setTripDropdown] = useState(false);
  const [tripFilter, setTripFilter] = useState("All Trips");
  const [trips, setTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/rides?customer_id=${Cookies.get('user_id')}`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        });
      const data = await response.json();
      setTrips(data);
      
      const currentDate = new Date();
      setUpcomingTrips(data.filter(trip => new Date(trip.date_time) > currentDate));
      setPastTrips(data.filter(trip => new Date(trip.date_time) <= currentDate));
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    alert(`File uploaded: ${selectedFile.name}`);
    setUploadModalOpen(false);
    setSelectedFile(null);
  };

  const handleTripSelect = (filter) => {
    setTripFilter(filter);
    setTripDropdown(false);

    const currentDate = new Date();
    let filteredTrips;

    switch (filter) {
      case "All Trips":
        filteredTrips = trips;
        break;
      case "Past 30 days":
        const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredTrips = trips.filter(trip => new Date(trip.date_time) > thirtyDaysAgo && new Date(trip.date_time) <= currentDate);
        break;
      default:
        const selectedMonth = new Date(filter + " 1, " + currentDate.getFullYear()).getMonth();
        filteredTrips = trips.filter(trip => new Date(trip.date_time).getMonth() === selectedMonth);
    }

    setPastTrips(filteredTrips);
  };

  const handleTripDetails = (trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTrip(null);
  };

  return (
    <div className="uber-trips-page">
      <Header />

      <main className="uber-main">
        <div className="trips-content">
          <section className="upcoming-trips">
            <h2>Upcoming</h2>
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map(trip => (
                <div key={trip.id} className="trip-item"  onClick={() => handleTripDetails(trip)}>
                  <h3>{trip.destination}</h3>
                  <p>{new Date(trip.date_time).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <>
                <div className="trip-banner">
                  <img src={carIllustration} alt="Car Illustration" />
                </div>
                <h2>You have no upcoming trips</h2>
                <button
                  className="request-ride-button"
                  onClick={() => navigate("/customer/home")}
                >
                  Reserve ride
                </button>
              </>
            )}
          </section>

          <section className="past-trips">
            <h2>Past</h2>
            <div className="trip-filters">
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

            {pastTrips.map(trip => (
              <div key={trip.id} className="past-trip-item"  onClick={() => handleTripDetails(trip)}>
                <div className="past-trip-map">
                  <img src={trip.mapImage || "https://via.placeholder.com/150"} alt="Trip Map" />
                </div>
                <div className="past-trip-info">
                  <h4>{trip.dropoff_location.locationName}</h4>
                  <p>{new Date(trip.date_time).toLocaleString()}</p>
                  <p>${trip.fare ? trip.fare.toFixed(2) : 'N/A'} • {trip.status}</p>
                  <div className="past-trip-buttons">
                    <button>Help</button>
                    <button>Details</button>
                    <button>Rebook</button>
                  </div>
                </div>
              </div>
            ))}

               {/* Upload Button */}
          <div className="upload-section text-center">
            <button
              className="upload-button btn btn-primary"
              onClick={() => setUploadModalOpen(true)}
            >
              Upload File
            </button>
          </div>

          {/* Upload Modal */}
          <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
            <div className="upload-modal-content">
              <h3>Upload File</h3>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
              {selectedFile && <p>Selected File: {selectedFile.name}</p>}
              <div className="mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setUploadModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleFileUpload}>
                  Upload
                </button>
              </div>
            </div>
          </Modal>
          </section>
        </div>

        <div className="ride-promo">
          <img src={carIllustration} alt="Car Illustration" className="promo-image" />
          <h3>Get a ride in minutes</h3>
          <p>Book an Uber from a web browser, no app install necessary.</p>
          <button
            className="request-ride-button"
            onClick={() => navigate("/customer/home")}
          >
            Request a Ride
          </button>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedTrip && <TripDetails tripData={selectedTrip} />}
        </Modal>
      </main>
    </div>
  );
};

export default TripsList;


