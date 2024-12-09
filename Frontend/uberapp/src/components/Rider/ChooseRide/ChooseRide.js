// ChooseRide.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseRide.css";
import ConfirmRequest from "../ConfirmRequest/ConfirmRequest";
import AddPaymentMethod from "../../Payments/AddPaymentMethod";
import uberX from "./uberx.jpg";
import uberXL from "./uberxl.jpg";
import comfort from "./ubercomfort.jpg";
import share from "./uberxshare.jpg";
import comfortElectric from "./ubercomfort.jpg";
import green from "./ubergreen.jpg";
import uberPet from "./uberxpet.jpg";
import black from "./uberblack.jpg";
import blackSUV from "./uberblacksuv.jpg";
import wav from "./uberwav.jpg";
import assist from "./uberassist.jpg";
import carSeat from "./ubercarseat.jpg";
import applePay from "./applepay.jpg";
import AddPaymentModal from "../../Payments/AddPaymentModal";
import PaymentListModal from "../../Payments/PaymentListModal";
import {BASE_API_URL} from '../../../Setupconstants';
import Cookies from 'js-cookie';

const ChooseRide = ({ onClose, pickupLocation, dropoffLocation }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showPaymentList, setShowPaymentList] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState("Apple Pay • Personal");
  const [dynamicPrices, setDynamicPrices] = useState({});
  const [selectedRide, setSelectedRide] = useState(null);

  const fetchEstimatedPrice = async (vehicleType) => {
    try {
      const url = `${BASE_API_URL}/api/rides/estimated-price/`;
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('access_token')}`,
        },
        params: {
          location: JSON.stringify({
            lat: pickupLocation.lat,
            lng: pickupLocation.lng,
          }),
          destination: JSON.stringify({
            lat: dropoffLocation.lat,
            lng: dropoffLocation.lng,
          }),
          vehicle_type: vehicleType,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch estimated price');
      }
  
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error('Error fetching estimated price:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllPrices = async () => {
      const prices = {};
      for (const category of rideOptions) {
        for (const option of category.options) {
          prices[option.name] = await fetchEstimatedPrice(option.name.toLowerCase());
        }
      }
      setDynamicPrices(prices);
    };

    fetchAllPrices();
  }, [pickupLocation, dropoffLocation]);

  const handleRequestClick = () => {
    if (selectedRide) {
      setShowConfirm(true);
    } else {
      alert('Please select a ride option before requesting.');
    }
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
  };

  const handlePaymentClick = () => {
    // setShowAddPayment(true);
  };

  const handleAddPaymentClick = () => {
    setShowAddPayment(true);
  };

  const handlePaymentListClick = () => {
    setShowPaymentList(true);
  };

  const handleCloseAddPayment = () => {
    setShowAddPayment(false);
  };

  const handleClosePaymentList = () => {
    setShowPaymentList(false);
  };

  const addPayment = (newPayment) => {
    setCurrentPaymentMethod(newPayment);
    console.log("New payment method added:", newPayment);
    setShowAddPayment(false);
  };

  const rideOptions = [
    {
      category: "Recommended",
      options: [
        {
          name: "UberX",
          img: uberX,
          details: "3 mins away • 11:00 PM",
          description: "Affordable rides all to yourself",
        },
        {
          name: "UberXL",
          img: uberXL,
          details: "5 mins away • 11:05 PM",
          description: "Affordable rides for groups up to 6",
        },
        {
          name: "Comfort",
          img: comfort,
          details: "4 mins away • 11:03 PM",
          description: "Newer cars with extra legroom",
        },
      ],
    },
    {
      category: "Popular",
      options: [
        {
          name: "Share",
          img: share,
          details: "6 mins away • 11:10 PM",
          description: "One seat only",
        },
        {
          name: "Comfort Electric",
          img: comfortElectric,
          details: "4 mins away • 11:00 PM",
          description: "Newer zero-emission cars with extra legroom",
        },
      ],
    },
    {
      category: "Economy",
      options: [
        {
          name: "Green",
          img: green,
          details: "6 mins away • 11:01 PM",
          description: "Affordable rides in eco-friendly cars",
        },
      ],
    },
    {
      category: "Premium",
      options: [
        {
          name: "Black",
          img: black,
          details: "5 mins away • 11:01 PM",
          description: "Luxury rides with professional drivers",
        },
        {
          name: "Black SUV",
          img: blackSUV,
          details: "5 mins away • 11:01 PM",
          description: "Luxury rides for 6 with professional drivers",
        },
      ],
    },
    {
      category: "More",
      options: [
        {
          name: "WAV",
          img: wav,
          details: "Unavailable",
          description: "Wheelchair accessible vehicles",
        },
        {
          name: "Assist",
          img: assist,
          details: "8 mins away • 11:05 PM",
          description: "Special assistance from certified drivers",
        },
        {
          name: "Car Seat",
          img: carSeat,
          details: "7 mins away • 11:07 PM",
          description: "Rides with a car seat",
        },
      ],
    },
  ];

  return (
    <div className="choose-ride-wrapper">
      <div className="overlay" onClick={onClose}></div>

      <div className="choose-ride-sidebar active">
        <div className="choose-ride-header">
          <h2>Choose a ride</h2>
          <button className="close-sidebar" onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="location-info">
          <p>From: {pickupLocation.address}</p>
          <p>To: {dropoffLocation.address}</p>
        </div>

        <div className="ride-options-container">
          {rideOptions.map((category, index) => (
            <div key={index}>
              <h3 className="ride-category">{category.category}</h3>
              {category.options.map((ride, idx) => (
                <div 
                  className={`ride-option ${selectedRide === ride.name ? 'selected' : ''}`} 
                  key={idx}
                  onClick={() => setSelectedRide(ride.name)}
                >
                  <img className="car-image" src={ride.img} alt={ride.name} />
                  <div className="ride-info">
                    <h4>{ride.name}</h4>
                    <p>{ride.details}</p>
                    <p>{ride.description}</p>
                  </div>
                  <p className="price">
                    {dynamicPrices[ride.name] ? `$${dynamicPrices[ride.name].toFixed(2)}` : 'Loading...'}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="ride-footer">
          <div className="payment-info" onClick={handlePaymentClick}>
            <img className="payment-logo" src={applePay} alt="Apple Pay" />
            <p>{currentPaymentMethod}</p>
            <button onClick={handlePaymentListClick}>Change Payment</button>
          </div>
          <button className="request-ride-button" onClick={handleRequestClick}>
            Request
          </button>
          <button onClick={handleAddPaymentClick}>Add Payment Method</button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmRequest 
          onClose={handleCloseConfirm} 
          selectedRide={selectedRide}
          estimatedPrice={dynamicPrices[selectedRide]}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
        />
      )}
      {showAddPayment && <AddPaymentModal onClose={handleCloseAddPayment} addPayment={addPayment} />}
      {showPaymentList && <PaymentListModal onClose={handleClosePaymentList} />}
    </div>
  );
};

export default ChooseRide;