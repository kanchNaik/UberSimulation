import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Bills.css";
import { BASE_API_URL } from "../../../Setupconstants";
import Cookies from 'js-cookie';
import { messageService } from "../../Common/Message/MessageService";

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [filters, setFilters] = useState({
    bill_id: "",
    ride_id: "",
    driver_name: "",
    customer_name: "",
    amount: "",
    status: "",
    date_range: "",
    start_date: "",
    end_date: ""
  });

  // Fetch data using the search API
  const fetchBills = async (searchParams) => {
    try {
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== "")
      );
      
      const response = await axios.get(
        `${BASE_API_URL}/api/billing/search/`,
        {
          params,
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );
      setBills(response.data);
    } catch (error) {
      console.error("Error fetching bills:", error);
      messageService.showMessage('error', 'Error fetching bills');
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBills({});
  }, []);

  // Handle input change for filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle search button click
  const handleSearch = () => {
    fetchBills(filters);
  };

  return (
    <div className="bills-container">
      <h1>Bills</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Bill ID"
          name="bill_id"
          value={filters.bill_id}
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
        
        <select 
          name="date_range" 
          value={filters.date_range}
          onChange={handleFilterChange}
        >
          <option value="">Select Date Range</option>
          <option value="day">Today</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="6months">Last 6 Months</option>
          <option value="year">Last Year</option>
        </select>

        <input
          type="date"
          name="start_date"
          value={filters.start_date}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="end_date"
          value={filters.end_date}
          onChange={handleFilterChange}
        />

        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

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
          {bills.length > 0 ? (
            bills.map((bill) => (
              <tr key={bill.bill_id}>
                <td>{bill.bill_id}</td>
                <td>{bill.ride}</td>
                <td>{`${bill.driver_full_name}`}</td>
                <td>{`${bill.customer_full_name}`}</td>
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