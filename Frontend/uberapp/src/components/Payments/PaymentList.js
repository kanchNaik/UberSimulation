// src/components/Payments/PaymentList.js
import React from "react";
import PaymentMethodCard from "./PaymentMethodCard";
import { Link } from "react-router-dom";
import "./PaymentList.css";
import { useState, useEffect } from "react";

const PaymentList = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    // Simulate an API call to fetch payment methods
    const fetchPaymentMethods = async () => {
    //   const methods = []; // Empty initially to show "No payment methods available"
      const methods = [
        { id: 1, cardHolder: "John Doe", cardNumber: "1234-5678-9012-1234", expiryDate: "12/24" },
        { id: 2, cardHolder: "Jane Smith", cardNumber: "5678-9012-1234-5678", expiryDate: "11/25" },
      ];
      setPaymentMethods(methods);
    };

    fetchPaymentMethods();
  }, []);

    return (
      <div>
        <h1>Your Payment Methods</h1>
        {paymentMethods.length === 0 ? (
          <><p>No payment methods available. Please add one.</p>
            <Link to="/customer/payments/add">
            <button>Add Payment Method</button>
          </Link>
            </>
        ) : (
          <ul>
            {paymentMethods.map((method) => (
             <PaymentMethodCard key={method.id} payment={method} />
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default PaymentList;
  