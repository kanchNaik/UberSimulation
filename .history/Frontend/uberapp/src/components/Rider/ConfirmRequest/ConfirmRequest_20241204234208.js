import React from "react";
import "./ConfirmRequest.css"; // Add styling specific to ConfirmRequest

const ConfirmRequest = ({ isOpen, onClose, onConfirm, fare }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Confirm updated fare ${fare}</h3>
        <p>Your previous fare has expired due to the elapsed time.</p>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm and request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRequest;
