import React from "react";
import "./ConfirmRequest.css";

const ConfirmRequest = ({ onClose }) => {
  return (
    <div className="confirm-request-wrapper">
      <div className="confirm-request-overlay" onClick={onClose}></div>
      <div className="confirm-request-modal">
        <h3>Confirm updated fare $16.42</h3>
        <p>Your previous fare has expired due to the elapsed time.</p>
        <div className="confirm-request-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button">Confirm and request</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRequest;
