import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Bills.css"; // Add CSS for styling

const Bills = () => {
  const [bills, setBills] = useState([]); // To store all bills
  const [filteredBills, setFilteredBills] = useState([]); // To store filtered bills
  const [filters, setFilters] = useState({
    id: "",
    ride_id: "",
    driver_name: "",
    customer_name: "",
    amount: "",
    status: "",
  });

  // Fetch data from the backend
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bills"); // Replace with your API endpoint
        setBills(response.data);
        setFilteredBills(response.data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching bills:", error);
      }
    };
    fetchBills();
  }, []);

  // Apply filters when the "Search" button is clicked
  const handleSearch = () => {
    const filtered = bills.filter((bill) =>
      Object.keys(filters).every((key) => {
        if (!filters[key]) return true; // Skip empty filters
        return bill[key]
          ?.toString()
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      })
    );
    setFilteredBills(filtered);
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
    <div className="bills-container">
      <h1>Bills</h1>

      {/* Filters Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Bill ID"
          name="id"
          value={filters.id}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Ride ID"
          name="ride_id"
          value={filters.ride_id}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Driver Name"
          name="driver_name"
          value={filters.driver_name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Customer Name"
          name="customer_name"
          value={filters.customer_name}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          placeholder="Amount"
          name="amount"
          value={filters.amount}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          placeholder="Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Bills Table */}
      <table className="bills-table">
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Ride ID</th>
            <th>Driver Name</th>
            <th>Customer Name</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.ride_id}</td>
                <td>{bill.driver_name}</td>
                <td>{bill.customer_name}</td>
                <td>${bill.amount}</td>
                <td>{bill.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-results">
                No bills found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Bills;
