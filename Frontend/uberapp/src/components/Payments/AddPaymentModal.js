import React from "react";
import AddPaymentMethod from "./AddPaymentMethod";
// import "./AddPaymentModal.css";

const AddPaymentModal = ({ onClose, addPayment }) => {
  const handleOverlayClick = (event) => {
    if (event.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>✖</button>
        <AddPaymentMethod addPayment={addPayment} />
      </div>
    </div>
  );
};

export default AddPaymentModal; 