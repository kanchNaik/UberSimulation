import React from "react";
import PaymentList from "./PaymentList";
// import "./PaymentListModal.css";

const PaymentListModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>✖</button>
        <PaymentList />
      </div>
    </div>
  );
};

export default PaymentListModal; 