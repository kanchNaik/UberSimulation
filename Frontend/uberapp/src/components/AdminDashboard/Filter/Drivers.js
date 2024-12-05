import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Drivers.css"; // Add a CSS file for styling

const Drivers = () => {
  const [drivers, setDrivers] = useState([]); // To store all drivers
  const [filteredDrivers, setFilteredDrivers] = useState([]); // To store filtered drivers
  const [filters, setFilters] = useState({
    username: "",
    first_name: "",
    last_name: "",
    city: "",
    state: "",
    zip_code: "",
    license_number: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_license_plate: "",
  });

  // Fetch data from the backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/drivers"); // Replace with your API endpoint
        setDrivers(response.data);
        setFilteredDrivers(response.data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  // Apply filters when the "Search" button is clicked
  const handleSearch = () => {
    const filtered = drivers.filter((driver) =>
      Object.keys(filters).every((key) => {
        if (!filters[key]) return true; // Skip empty filters
        const [field, subfield] = key.split("_");
        if (subfield) {
          // For nested fields like vehicle_make
          return driver[field]?.[subfield]
            ?.toString()
            .toLowerCase()
            .includes(filters[key].toLowerCase());
        }
        return driver[key]
          ?.toString()
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      })
    );
    setFilteredDrivers(filtered);
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
    <div className="drivers-container">
      <h1>Drivers</h1>

      {/* Filters Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={filters.username}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="First Name"
          name="first_name"
          value={filters.first_name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Last Name"
          name="last_name"
          value={filters.last_name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="City"
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="State"
          name="state"
          value={filters.state}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Zip Code"
          name="zip_code"
          value={filters.zip_code}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="License Number"
          name="license_number"
          value={filters.license_number}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Vehicle Make"
          name="vehicle_make"
          value={filters.vehicle_make}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Vehicle Model"
          name="vehicle_model"
          value={filters.vehicle_model}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Vehicle Year"
          name="vehicle_year"
          value={filters.vehicle_year}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="License Plate"
          name="vehicle_license_plate"
          value={filters.vehicle_license_plate}
          onChange={handleFilterChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Driver Table */}
      <table className="drivers-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
            <th>License Number</th>
            <th>Vehicle Make</th>
            <th>Vehicle Model</th>
            <th>Vehicle Year</th>
            <th>License Plate</th>
          </tr>
        </thead>
        <tbody>
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.username}</td>
                <td>{driver.first_name}</td>
                <td>{driver.last_name}</td>
                <td>{driver.city}</td>
                <td>{driver.state}</td>
                <td>{driver.zip_code}</td>
                <td>{driver.license_number}</td>
                <td>{driver.vehicle?.make}</td>
                <td>{driver.vehicle?.model}</td>
                <td>{driver.vehicle?.year}</td>
                <td>{driver.vehicle?.license_plate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="no-results">
                No drivers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Drivers;
