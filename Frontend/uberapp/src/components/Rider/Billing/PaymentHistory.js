import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PaymentHistory.css";
import { BASE_API_URL } from "../../../Setupconstants";
import Cookies from "js-cookie";

const PaymentHistory = () => {
  const [bills, setBills] = useState([]); // State for fetched bills
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null); // State for errors

  const userId = Cookies.get("user_id"); // Retrieve user ID from cookies (or any other source)

  // Fetch bills from the existing /api/billing/search endpoint
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear any previous errors

      try {
        const response = await axios.get(`${BASE_API_URL}/api/billing/search`, {
          params: { user_id: userId },
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        });

        setBills(response.data); // Update bills state with fetched data
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("Failed to fetch payment history");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPaymentHistory();
  }, [userId]);

  // Filter bills by searchTerm
  const filteredBills = bills.filter((bill) =>
    bill.bill_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="payment-history">
      <h1>Payment History</h1>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Bill ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Loading State */}
      {loading && <p>Loading payment history...</p>}

      {/* Error State */}
      {error && <p className="error-message">{error}</p>}

      {/* Table */}
      {!loading && !error && (
        <table className="payment-history-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Driver</th>
              <th>Customer</th>
              <th>Ride</th>
              <th>Date</th>
              <th>Distance</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.bill_id}>
                <td>{bill.bill_id}</td>
                <td>{bill.driver_full_name}</td>
                <td>{bill.customer_full_name}</td>
                <td>{bill.ride}</td>
                <td>{bill.date}</td>
                <td>{bill.distance}</td>
                <td>${bill.amount}</td>
                <td>{bill.status}</td>
              </tr>
            ))}
            {filteredBills.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;
