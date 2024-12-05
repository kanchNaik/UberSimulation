import React from 'react';
import './Trips.css';

const Trips = () => {
  const pastTrips = [
    {
      date: 'Dec 2',
      location: 'San José Mineta International Airport (SJC)',
      time: '1:59 PM',
      price: '$0.00',
      status: 'Canceled',
    },
  ];

  return (
    <div className="trips-page">
      {/* Upcoming Section */}
      <section className="upcoming-section">
        <h2>Upcoming</h2>
        <div className="upcoming-content">
          <img
            src="/path-to-upcoming-graphic.png"
            alt="Upcoming Trips"
            className="upcoming-image"
          />
          <div className="upcoming-details">
            <p>You have no upcoming trips</p>
            <button className="reserve-btn">
              <i className="fas fa-clock"></i> Reserve ride
            </button>
          </div>
        </div>
      </section>

      {/* Past Section */}
      <section className="past-section">
        <h2>Past</h2>
        {pastTrips.map((trip, index) => (
          <div key={index} className="past-trip">
            <h3>{trip.date}</h3>
            <div className="trip-details">
              <div className="trip-map">
                <img
                  src="/path-to-map-placeholder.png"
                  alt="Map"
                  className="map-image"
                />
              </div>
              <div className="trip-info">
                <h4>{trip.location}</h4>
                <p>
                  {trip.time} · {trip.price} · {trip.status}
                </p>
                <div className="trip-actions">
                  <button className="trip-action-btn">Help</button>
                  <button className="trip-action-btn">Details</button>
                  <button className="trip-action-btn">Rebook</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Trips;
