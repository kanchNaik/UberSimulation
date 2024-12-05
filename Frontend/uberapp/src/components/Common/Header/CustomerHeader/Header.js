import React from "react";
import { FaCar, FaBox, FaUserCircle } from "react-icons/fa";
import "./HeaderStyles.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Uber</div>
      <nav className="nav">
        <ul>
          <li aria-label="Ride option">
            <FaCar /> Ride
          </li>
          <li aria-label="Rent option">
            <FaCar /> Rent
          </li>
          <li aria-label="Package delivery option">
            <FaBox /> Package
          </li>
          <li aria-label="Hourly booking option">
            <FaCar /> Hourly
          </li>
        </ul>
      </nav>
      <div className="profile">
        <span>My trips</span>
        <FaUserCircle className="profile-icon" aria-label="Profile icon" />
      </div>
    </header>
  );
};

export default Header;
