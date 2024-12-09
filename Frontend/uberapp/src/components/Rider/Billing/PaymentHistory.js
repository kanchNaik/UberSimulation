import React, { useState } from 'react';
import './PaymentHistory.css';

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  // Static bills data
  const bills = [
    {
      bill_id: '12345',
      driver: 'John Doe',
      customer: 'Jane Smith',
      ride: 'Ride 56789',
      date: '2024-12-01',
      distance: '12.5 km',
      amount: '$25.00',
      status: 'Paid',
    },
    {
      bill_id: '67890',
      driver: 'Alice Brown',
      customer: 'Bob White',
      ride: 'Ride 67890',
      date: '2024-12-02',
      distance: '15.0 km',
      amount: '$30.00',
      status: 'Unpaid',
    },
    {
      bill_id: '54321',
      driver: 'Tom Green',
      customer: 'Sara Black',
      ride: 'Ride 54321',
      date: '2024-12-03',
      distance: '10.0 km',
      amount: '$20.00',
      status: 'Paid',
    },
  ];

//   useEffect(() => {
//     // Fetch bills from API
//     const fetchBills = async () => {
//       try {
//         const response = await fetch('/api/billing'); // Replace with your API endpoint
//         if (!response.ok) throw new Error('Failed to fetch bills');
//         const data = await response.json();
//         setBills(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBills();
//   }, []);

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

      {/* Table */}
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
              <td>{bill.driver}</td>
              <td>{bill.customer}</td>
              <td>{bill.ride}</td>
              <td>{bill.date}</td>
              <td>{bill.distance}</td>
              <td>{bill.amount}</td>
              <td>{bill.status}</td>
            </tr>
          ))}
          {filteredBills.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
