// src/components/Payments/PaymentMethodCard.js
import React from "react";
import "./PaymentMethodCard.css";

const PaymentMethodCard = ({ payment, onDelete, onSetDefault }) => {
  // Mask the card number to show only last 4 digits
  const maskedNumber = `**** **** **** ${payment.card_number.slice(-4)}`;

  return (
    <div className={`payment-method-card ${payment.is_default ? 'default' : ''}`}>
      <div className="card-info">
        <div className="card-type">{payment.card_type}</div>
        <div className="card-number">{maskedNumber}</div>
        <div className="card-holder">{payment.card_holder_name}</div>
        <div className="expiry">Expires: {payment.expiration_date}</div>
      </div>
      <div className="card-actions">
        {!payment.is_default && (
          <button 
            onClick={onSetDefault}
            className="set-default-button"
          >
            Set as Default
          </button>
        )}
        {payment.is_default && (
          <span className="default-badge">Default</span>
        )}
        <button 
          onClick={onDelete}
          className="delete-button"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default PaymentMethodCard;
