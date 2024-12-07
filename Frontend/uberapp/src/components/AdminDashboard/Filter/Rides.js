import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Rides.css";
import { BASE_API_URL } from "../../../Setupconstants";
import Cookies from "js-cookie";
import { messageService } from "../../Common/Message/MessageService";

const accessToken = Cookies.get("access_token");

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [filters, setFilters] = useState({
    driver: "",
    customer: "",
    pickup_start: "",
    pickup_end: "",
    dropoff_start: "",
    dropoff_end: "",
    pickup_name: "",
    pickup_city: "",
    dropoff_name: "",
    dropoff_city: "",
  });

  const fetchRides = async () => {
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value !== "")
      ).toString();
      const response = await axios.get(
        `${BASE_API_URL}/api/rides/ride-search/?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRides(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("Error fetching rides:", error);
      messageService.showMessage('error', 'Error fetching rides');
      setRides([]);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    fetchRides();
  };

  return (
    <div className="rides-container">
      <h1>Rides</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Driver Name"
          name="driver"
          value={filters.driver}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Customer Name"
          name="customer"
          value={filters.customer}
          onChange={handleFilterChange}
        />
        <input
          type="datetime-local"
          placeholder="Pickup Start"
          name="pickup_start"
          value={filters.pickup_start}
          onChange={handleFilterChange}
        />
        <input
          type="datetime-local"
          placeholder="Pickup End"
          name="pickup_end"
          value={filters.pickup_end}
          onChange={handleFilterChange}
        />
        <input
          type="datetime-local"
          placeholder="Dropoff Start"
          name="dropoff_start"
          value={filters.dropoff_start}
          onChange={handleFilterChange}
        />
        <input
          type="datetime-local"
          placeholder="Dropoff End"
          name="dropoff_end"
          value={filters.dropoff_end}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Pickup Location Name"
          name="pickup_name"
          value={filters.pickup_name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Pickup Location City"
          name="pickup_city"
          value={filters.pickup_city}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Dropoff Location Name"
          name="dropoff_name"
          value={filters.dropoff_name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Dropoff Location City"
          name="dropoff_city"
          value={filters.dropoff_city}
          onChange={handleFilterChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="rides-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Driver</th>
            <th>Customer</th>
            <th>Date Time</th>
            <th>Pickup Time</th>
            <th>Dropoff Time</th>
            <th>Pickup Location</th>
            <th>Dropoff Location</th>
          </tr>
        </thead>
        <tbody>
          {rides.length > 0 ? (
            rides.map((ride) => (
              <tr key={ride.ride_id}>
                <td>{ride.ride_id}</td>
                <td>{ride.driver_name}</td>
                <td>{ride.customer_name}</td>
                <td>
                  {ride.date_time ? new Date(ride.date_time).toLocaleString() : "N/A"}
                </td>
                <td>
                  {ride.pickup_time ? new Date(ride.pickup_time).toLocaleString() : "N/A"}
                </td>
                <td>
                  {ride.dropoff_time ? new Date(ride.dropoff_time).toLocaleString() : "N/A"}
                </td>
                <td>
                  {ride.pickup_location
                    ? `${ride.pickup_location.locationName}, ${ride.pickup_location.locationCity}`
                    : "N/A"}
                </td>
                <td>
                  {ride.dropoff_location
                    ? `${ride.dropoff_location.locationName}, ${ride.dropoff_location.locationCity}`
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-results">
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
