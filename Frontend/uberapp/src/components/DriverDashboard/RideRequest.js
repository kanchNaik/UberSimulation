import React, { useState } from "react";
import Modal from "react-modal";
import "./RideRequest.css";

Modal.setAppElement("#root");

const RideRequest = ({
  riderName,
  pickupLocation,
  dropoffLocation,
  distance,
  time,
  onAccept,
  onDecline,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(null);

  const openModal = (message, action) => {
    console.log("Opening modal...");
    setModalMessage(message);
    setModalAction(() => action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };

  const handleConfirm = () => {
    if (modalAction) modalAction();
    closeModal();
  };

  return (
    <div className="ride-request-container">
      <div className="ride-details">
        <h2>Ride Request</h2>
        <p><strong>Rider:</strong> {riderName}</p>
        <p><strong>Pickup:</strong> {pickupLocation}</p>
        <p><strong>Dropoff:</strong> {dropoffLocation}</p>
        <p><strong>Distance:</strong> {distance}</p>
        <p><strong>Estimated Time:</strong> {time}</p>
      </div>
      <div className="action-buttons">
        <button
          className="accept-button"
          onClick={() => openModal("Are you sure you want to accept this ride?", onAccept)}
        >
          Accept Ride
        </button>
        <button
          className="decline-button"
          onClick={() => openModal("Are you sure you want to decline this ride?", onDecline)}
        >
          Decline Ride
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h3>Confirmation</h3>
          <p>{modalMessage}</p>
          <div className="modal-buttons">
            <button className="modal-confirm-button" onClick={handleConfirm}>
              Yes
            </button>
            <button className="modal-cancel-button" onClick={closeModal}>
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RideRequest;
