import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faUser, faCar, faDollarSign, faRuler } from '@fortawesome/free-solid-svg-icons';
import './TripDetails.css';
import Modal from '../../Common/Modal/Modal'; // Make sure Modal is correctly imported

const TripDetails = ({ tripData }) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    alert(`File uploaded: ${selectedFile.name}`);
    setUploadModalOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="trip-details-container">
      <h2>Trip Details</h2>
      
      <div className="trip-locations">
        <div className="location-item pickup">
          <div className="location-marker">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="marker-icon pickup-icon" />
          </div>
          <div className="location-info">
            <span className="location-label">Pickup</span>
            <h3>{tripData.pickup_location.locationName}</h3>
            <p>{tripData.pickup_time}</p>
          </div>
        </div>
        
        <div className="location-item dropoff">
          <div className="location-marker">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="marker-icon dropoff-icon" />
          </div>
          <div className="location-info">
            <span className="location-label">Dropoff</span>
            <h3>{tripData.dropoff_location.locationName}</h3>
            <p>{tripData.dropoff_time}</p>
          </div>
        </div>
      </div>

      <div className="trip-details-grid">
        <div className="detail-item">
          <FontAwesomeIcon icon={faClock} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Trip Date</span>
            <p>{tripData.date_time}</p>
          </div>
        </div>
        
        <div className="detail-item">
          <FontAwesomeIcon icon={faUser} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Customer ID</span>
            <p>{tripData.customer}</p>
          </div>
        </div>

        <div className="detail-item">
          <FontAwesomeIcon icon={faCar} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Driver ID</span>
            <p>{tripData.driver}</p>
          </div>
        </div>

        <div className="detail-item">
          <FontAwesomeIcon icon={faDollarSign} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Fare</span>
            <p>${tripData.fare}</p>
          </div>
        </div>

        <div className="detail-item">
          <FontAwesomeIcon icon={faRuler} className="detail-icon" />
          <div className="detail-content">
            <span className="detail-label">Distance</span>
            <p>{tripData.distance} miles</p>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div className="upload-section text-center">
        <button
          className="upload-button btn btn-primary"
          onClick={() => setUploadModalOpen(true)}
        >
          Upload File
        </button>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <div className="upload-modal-content">
          <h3>Upload Images from Ride</h3>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          {selectedFile && <p>Selected File: {selectedFile.name}</p>}
          <div className="mt-3">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setUploadModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleFileUpload}>
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TripDetails;
