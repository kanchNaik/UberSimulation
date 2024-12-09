import React, { useState, useEffect } from "react";
import "./RideStatus.css";
import Map from "../../Common/Map/Map";
import Header from "../../Common/Header/CustomerHeader/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faMapPin, faStar } from "@fortawesome/free-solid-svg-icons";
import { BASE_API_URL } from "../../../Setupconstants";

const RideStatus = ({ isDriver = false }) => {
  const [showStatus, setShowStatus] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleReviewSubmit = async () => {
    if (review.trim() === "") {
      alert("Please enter a review before submitting.");
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/api/rides/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers here
        },
        body: JSON.stringify({
          review_text: review,
          rating: rating,
          // Add ride_id or driver_id as needed
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Review submitted successfully:', result);
      setIsReviewSubmitted(true);
      setSubmitError(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitError("Failed to submit review. Please try again.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="ride-status-container">
      <Header />

      {showStatus && (
        <div className="confirmation-status">
          <p>Your ride is confirmed and on its way!</p>
        </div>
      )}

      <div className="ride-status-content">
        <div className="card details-card">
          <div className="ride-status-title">
            {isDriver ? "Juan is on trip" : "Francisco Hernandez is on the way"}
          </div>

          <div className="location-details">
            <div className="location-item">
              <FontAwesomeIcon icon={faMapPin} className="location-icon" />
              <span className="location-text">Current Location</span>
            </div>
            <p className="address">123 Columbus Ave</p>
            <div className="location-item">
              <FontAwesomeIcon icon={faLocationDot} className="location-icon" />
              <span className="location-text">Destination</span>
            </div>
            {!isDriver && <p className="destination">1839 Grant Ave</p>}
          </div>

          <div className="navigate-section">
            <button className="cancel-button">Cancel Ride</button>
            <button className="navigate-button">Navigate</button>
          </div>

          <div className="driver-info-section">
            <b>
              <h3 className="driver-info-title">Driver</h3>
            </b>
            <div className="driver-info">
              <img
                src="https://via.placeholder.com/50"
                alt="Driver"
                className="driver-image"
              />
              <div className="driver-details">
                <h4 className="driver-plate">3M53AF2</h4>
                <p className="driver-car-details">Silver Honda Civic</p>
                <p className="driver-rating">
                  Anderson &middot; <span className="rating">4.8 ★</span>
                </p>
              </div>
            </div>
          </div>

          <div className="rating-section">
            <h3 className="rating-title">How was your trip with Francisco?</h3>
            <p className="rating-subtitle">Tuesday morning to 1839 Grant Ave</p>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((value) => (
                <FontAwesomeIcon
                  key={value}
                  icon={faStar}
                  className={`star-icon ${value <= rating ? "selected" : ""}`}
                  onClick={() => handleRating(value)}
                />
              ))}
            </div>
            <p className="tip-message">After rating, you can add a tip</p>
          </div>

          <div className="review-section">
            {!isReviewSubmitted ? (
              <>
                <h3 className="review-title">Leave a Review</h3>
                <textarea
                  className="review-textarea"
                  placeholder="Write your review here..."
                  value={review}
                  onChange={handleReviewChange}
                />
                <button className="submit-review-button" onClick={handleReviewSubmit}>
                  Submit Review
                </button>
                {submitError && <p className="error-message">{submitError}</p>}
              </>
            ) : (
              <div className="review-thank-you">
                <p>Thank you for your review!</p>
                <p>Your feedback: {review}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card map-card">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default RideStatus;