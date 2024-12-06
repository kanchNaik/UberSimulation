
import { useNavigate } from "react-router-dom";
import "./ConfirmRequest.css";
import uberX from "../ChooseRide/uberx.jpg";

const ConfirmRequest = ({ onClose }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
      navigate("/customer/ridestatus"); // Navigate to the next page
  };

  return (
    <div className="confirm-request-wrapper">
      {/* Overlay */}
      <div className="confirm-request-overlay" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="confirm-request-modal">
        {/* Fare Update Message */}
        <div className="fare-update-message">
          <h3>Confirm updated fare $16.42</h3>
          <p>Your previous fare has expired due to the elapsed time.</p>
        </div>

        {/* Ride Details */}
        <div className="ride-details">
          <img className="car-image" src={uberX} alt="UberX" />
          <div className="ride-info">
            <h4>UberX</h4>
            <p>13:39 • 2 min away</p>
            <p>Affordable everyday trips</p>
          </div>
          <div className="price">
            <h4>$16.42</h4>
          </div>
        </div>

        {/* Buttons */}
        <div className="confirm-request-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={handleConfirm}>
            Confirm and request
          </button>
        </div>
      </div>

    </div>
  );
};

export default ConfirmRequest;
