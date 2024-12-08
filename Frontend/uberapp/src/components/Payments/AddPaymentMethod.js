import React, { useState } from "react";
import "./AddPaymentMethod.css";

const AddPaymentMethod = ({ addPayment, onClose }) => {
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

    if (typeof addPayment === "function") {
      addPayment(newPayment); // Save the new payment method
    }

    // Clear the form
    setCardNumber("");
    setExpiryDate("");
    setCardHolder("");
    setCvv("");

    // Close the popup
    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <div className="popup-header">
          <h3>Add Payment Method</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-content">
          <form onSubmit={handleSubmit} className="add-payment-form">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number:</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date:</label>
              <input
                type="text"
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cardHolder">Card Holder:</label>
              <input
                type="text"
                id="cardHolder"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV:</label>
              <input
                type="password"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
            <div className="buttons">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentMethod;
