// src/components/Payments/PaymentMethodCard.js
import React from "react";

const PaymentMethodCard = ({ payment }) => {
  return (
    <div style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
      <h4>{payment.cardHolder}</h4>
      <p>Card Number: **** **** **** {payment.cardNumber.slice(-4)}</p>
      <p>Expiry: {payment.expiryDate}</p>
    </div>
  );
};

export default PaymentMethodCard;
