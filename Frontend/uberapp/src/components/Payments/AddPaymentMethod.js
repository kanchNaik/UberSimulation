// src/components/Payments/AddPaymentMethod.js
import React, { useState } from "react";
import "./AddPaymentMethod.css";

const AddPaymentMethod = ({ addPayment }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPayment = {
      id: Date.now(),
      cardNumber,
      expiryDate,
      cardHolder,
      cvv,
    };
    addPayment(newPayment);
    setCardNumber("");
    setExpiryDate("");
    setCardHolder("");
    setCvv("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Payment Method</h3>
      <div>
        <label>Card Number:</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Expiry Date:</label>
        <input
          type="text"
          placeholder="MM/YY"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Card Holder:</label>
        <input
          type="text"
          value={cardHolder}
          onChange={(e) => setCardHolder(e.target.value)}
          required
        />
      </div>
      <div>
        <label>CVV:</label>
        <input
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Payment Method</button>
    </form>
  );
};

export default AddPaymentMethod;
