import React from "react";
import { FaCar, FaBox, FaUserCircle } from "react-icons/fa";
import "./../styles/HeaderStyles.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">Uber</div>
      <nav className="nav">
        <ul>
          <li>
            <FaCar /> Ride
          </li>
          <li>
            <FaCar /> Rent
          </li>
          <li>
            <FaBox /> Package
          </li>
          <li>
            <FaCar /> Hourly
          </li>
        </ul>
      </nav>
      <div className="profile">
        <span>My trips</span>
        <FaUserCircle className="profile-icon" />
      </div>
    </header>
  );
};

export default Header;
