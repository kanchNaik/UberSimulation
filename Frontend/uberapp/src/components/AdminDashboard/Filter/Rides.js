import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Rides.css"; // Add CSS for styling

const Rides = () => {
  const [rides, setRides] = useState([]); // To store all rides
  const [filteredRides, setFilteredRides] = useState([]); // To store filtered rides
  const [filters, setFilters] = useState({
    validate: "",
    pickup_time: "",
    dropoff_time: "",
    distance: "",
    source_location: "",
    destination_location: "",
  });

  // Fetch data from the backend
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rides"); // Replace with your API endpoint
        setRides(response.data);
        setFilteredRides(response.data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };
    fetchRides();
  }, []);

  // Apply filters when the "Search" button is clicked
  const handleSearch = () => {
    const filtered = rides.filter((ride) =>
      Object.keys(filters).every((key) => {
        if (!filters[key]) return true; // Skip empty filters
        return ride[key]
          ?.toString()
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      })
    );
    setFilteredRides(filtered);
  };

  // Handle input change for filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="rides-container">
      <h1>Rides</h1>

      {/* Filters Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Validate"
          name="validate"
          value={filters.validate}
          onChange={handleFilterChange}
        />
        <input
          type="datetime-local"
          placeholder="Pickup Time"
          name="pickup_time"
          value={filters.pickup_time}
          onChange={handleFilterChange}
        />
        <input
          type="datetime-local"
          placeholder="Dropoff Time"
          name="dropoff_time"
          value={filters.dropoff_time}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Distance (in miles)"
          name="distance"
          value={filters.distance}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Source Location"
          name="source_location"
          value={filters.source_location}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Destination Location"
          name="destination_location"
          value={filters.destination_location}
          onChange={handleFilterChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Rides Table */}
      <table className="rides-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Driver</th>
            <th>Customer</th>
            <th>Validate</th>
            <th>Pickup Time</th>
            <th>Dropoff Time</th>
            <th>Distance</th>
            <th>Source Location</th>
            <th>Destination Location</th>
            <th>Fare</th>
          </tr>
        </thead>
        <tbody>
          {filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <tr key={ride.id}>
                <td>{ride.id}</td>
                <td>{ride.driver}</td>
                <td>{ride.customer}</td>
                <td>{ride.validate}</td>
                <td>{ride.pickup_time}</td>
                <td>{ride.dropoff_time}</td>
                <td>{ride.distance}</td>
                <td>{ride.source_location}</td>
                <td>{ride.destination_location}</td>
                <td>{ride.fare}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="no-results">
                No rides found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Rides;
