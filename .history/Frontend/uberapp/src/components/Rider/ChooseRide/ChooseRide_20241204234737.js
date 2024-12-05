import React, { useState } from "react";
import "./ChooseRide.css"; // Add styling specific to ChooseRide
import ConfirmRequest from "../Rider/ConfirmRequest/ConfirmRequest";
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

const ChooseRide = ({ onClose }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRequestClick = () => {
    setShowConfirm(true);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
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
          price: "$16.50",
        },
        {
          name: "UberXL",
          img: uberXL,
          details: "5 mins away • 11:05 PM",
          description: "Affordable rides for groups up to 6",
          price: "$20.85",
        },
        {
          name: "Comfort",
          img: comfort,
          details: "4 mins away • 11:03 PM",
          description: "Newer cars with extra legroom",
          price: "$18.99",
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
          price: "$12.50",
        },
        {
          name: "Comfort Electric",
          img: comfortElectric,
          details: "4 mins away • 11:00 PM",
          description: "Newer zero-emission cars with extra legroom",
          price: "$20.68",
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
          price: "$16.93",
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
          price: "$30.10",
        },
        {
          name: "Black SUV",
          img: blackSUV,
          details: "5 mins away • 11:01 PM",
          description: "Luxury rides for 6 with professional drivers",
          price: "$37.10",
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
          price: "$16.79",
        },
        {
          name: "Assist",
          img: assist,
          details: "8 mins away • 11:05 PM",
          description: "Special assistance from certified drivers",
          price: "$17.06",
        },
        {
          name: "Car Seat",
          img: carSeat,
          details: "7 mins away • 11:07 PM",
          description: "Rides with a car seat",
          price: "$22.50",
        },
      ],
    },
  ];

  return (
    <div className="choose-ride-wrapper">
      {/* Overlay */}
      <div className="overlay" onClick={onClose}></div>

      {/* Sidebar */}
      <div className="choose-ride-sidebar active">
        <div className="choose-ride-header">
          <h2>Choose a ride</h2>
          <button className="close-sidebar" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* Ride Options */}
        <div className="ride-options-container">
          {rideOptions.map((category, index) => (
            <div key={index}>
              <h3 className="ride-category">{category.category}</h3>
              {category.options.map((ride, idx) => (
                <div className="ride-option" key={idx}>
                  <img className="car-image" src={ride.img} alt={ride.name} />
                  <div className="ride-info">
                    <h4>{ride.name}</h4>
                    <p>{ride.details}</p>
                    <p>{ride.description}</p>
                  </div>
                  <p className="price">{ride.price}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="ride-footer">
          <div className="payment-info">
            <img className="payment-logo" src={applePay} alt="Apple Pay" />
            <p>Apple Pay • Personal</p>
          </div>
          <button className="request-ride-button" onClick={handleRequestClick}>
            Request
          </button>
        </div>
      </div>

      {/* Confirm Request Modal */}
      {showConfirm && <ConfirmRequest onClose={handleCloseConfirm} />}
    </div>
  );
};

export default ChooseRide;
