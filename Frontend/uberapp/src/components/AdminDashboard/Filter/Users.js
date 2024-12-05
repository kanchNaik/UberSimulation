import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css"; // Add a CSS file for styling

const Users = () => {
  const [customers, setCustomers] = useState([]); // To store all customers
  const [filteredCustomers, setFilteredCustomers] = useState([]); // To store filtered customers
  const [filters, setFilters] = useState({
    username: "",
    first_name: "",
    last_name: "",
    city: "",
    state: "",
    zip_code: "",
  });

  // Fetch data from the backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/customers"); // Replace with your API endpoint
        setCustomers(response.data);
        setFilteredCustomers(response.data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Apply filters when the "Search" button is clicked
  const handleSearch = () => {
    const filtered = customers.filter((customer) =>
      Object.keys(filters).every((key) => {
        if (!filters[key]) return true; // Skip empty filters
        return customer[key]
          ?.toString()
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      })
    );
    setFilteredCustomers(filtered);
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
    <div className="users-container">
      <h1>Customers</h1>

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
          type="number"
          placeholder="Zip Code"
          name="zip_code"
          value={filters.zip_code}
          onChange={handleFilterChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Customer Table */}
      <table className="customer-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>State</th>
            <th>Zip Code</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.username}</td>
                <td>{customer.first_name}</td>
                <td>{customer.last_name}</td>
                <td>{customer.city}</td>
                <td>{customer.state}</td>
                <td>{customer.zip_code}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="no-results">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
