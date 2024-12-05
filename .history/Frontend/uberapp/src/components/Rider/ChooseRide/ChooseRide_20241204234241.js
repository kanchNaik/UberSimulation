import React from "react";
import "./ChooseRide.css"; // Add styling specific to ChooseRide
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
        <p className="promotion-text">15% promotion applied</p>

        {/* Scrollable Ride Options */}
        <div className="ride-options-container">
          {/* Recommended */}
          <h3 className="ride-category">Recommended</h3>
          <div className="ride-option">
            <img className="car-image" src={uberX} alt="UberX" />
            <div className="ride-info">
              <h4>UberX</h4>
              <p>3 mins away • 11:00 PM</p>
              <p>Affordable rides all to yourself</p>
            </div>
            <p className="price">$16.50</p>
          </div>

          <div className="ride-option">
            <img className="car-image" src={uberXL} alt="UberXL" />
            <div className="ride-info">
              <h4>UberXL</h4>
              <p>5 mins away • 11:05 PM</p>
              <p>Affordable rides for groups up to 6</p>
            </div>
            <p className="price">$20.85</p>
          </div>

          <div className="ride-option">
            <img className="car-image" src={comfort} alt="Comfort" />
            <div className="ride-info">
              <h4>Comfort</h4>
              <p>4 mins away • 11:03 PM</p>
              <p>Newer cars with extra legroom</p>
            </div>
            <p className="price">$18.99</p>
          </div>

          {/* Other Categories */}
          <h3 className="ride-category">Popular</h3>
          <div className="ride-option">
            <img className="car-image" src={share} alt="Share" />
            <div className="ride-info">
              <h4>Share</h4>
              <p>6 mins away • 11:10 PM</p>
              <p>One seat only</p>
            </div>
            <p className="price">$12.50</p>
          </div>

          <div className="ride-option">
            <img className="car-image" src={comfortElectric} alt="Comfort Electric" />
            <div className="ride-info">
              <h4>Comfort Electric</h4>
              <p>4 mins away • 11:00 PM</p>
              <p>Newer zero-emission cars with extra legroom</p>
            </div>
            <p className="price">$20.68</p>
          </div>

          <h3 className="ride-category">Economy</h3>
          <div className="ride-option">
            <img className="car-image" src={green} alt="Green" />
            <div className="ride-info">
              <h4>Green</h4>
              <p>6 mins away • 11:01 PM</p>
              <p>Affordable rides in eco-friendly cars</p>
            </div>
            <p className="price">$16.93</p>
          </div>

          <h3 className="ride-category">Uber Pet</h3>
          <div className="ride-option">
            <img className="car-image" src={uberPet} alt="Uber Pet" />
            <div className="ride-info">
              <h4>Uber Pet</h4>
              <p>4 mins away • 10:59 PM</p>
              <p>For you and your pet</p>
            </div>
            <p className="price">$20.85</p>
          </div>

          <h3 className="ride-category">Premium</h3>
          <div className="ride-option">
            <img className="car-image" src={black} alt="Black" />
            <div className="ride-info">
              <h4>Black</h4>
              <p>5 mins away • 11:01 PM</p>
              <p>Luxury rides with professional drivers</p>
            </div>
            <p className="price">$30.10</p>
          </div>
          <div className="ride-option">
            <img className="car-image" src={blackSUV} alt="Black SUV" />
            <div className="ride-info">
              <h4>Black SUV</h4>
              <p>5 mins away • 11:01 PM</p>
              <p>Luxury rides for 6 with professional drivers</p>
            </div>
            <p className="price">$37.10</p>
          </div>

          <h3 className="ride-category">More</h3>
          <div className="ride-option">
            <img className="car-image" src={wav} alt="WAV" />
            <div className="ride-info">
              <h4>WAV</h4>
              <p>Unavailable</p>
              <p>Wheelchair accessible vehicles</p>
            </div>
            <p className="price">$16.79</p>
          </div>

          <div className="ride-option">
            <img className="car-image" src={assist} alt="Assist" />
            <div className="ride-info">
              <h4>Assist</h4>
              <p>8 mins away • 11:05 PM</p>
              <p>Special assistance from certified drivers</p>
            </div>
            <p className="price">$17.06</p>
          </div>

          <div className="ride-option">
            <img className="car-image" src={carSeat} alt="Car Seat" />
            <div className="ride-info">
              <h4>Car Seat</h4>
              <p>7 mins away • 11:07 PM</p>
              <p>Rides with a car seat</p>
            </div>
            <p className="price">$22.50</p>
          </div>
        </div>
        {/* Footer */}
        <div className="ride-footer">
          <div className="payment-info">
            <img className="payment-logo" src={applePay} alt="Apple Pay" />
            <center><p>Apple Pay • Personal</p></center>
          </div>
          <center><button className="request-ride-button">Request</button></center>
        </div>
      </div>
    </div>

    
  );
};

export default ChooseRide;
