import React, { useState } from "react";
import { FaCar, FaBox, FaUserCircle, FaChevronDown } from "react-icons/fa";
import "./HeaderStyles.css";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    console.log("Dropdown toggled");
    setIsDropdownOpen(!isDropdownOpen);
  };

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
      <div className="profile" onClick={toggleDropdown} role="button" tabIndex={0}>
        <span>My trips</span>
        <FaUserCircle className="profile-icon" aria-label="Profile icon" />
        <FaChevronDown className="chevron-icon" aria-label="Dropdown icon" />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item">Wallet</div>
            <div className="dropdown-item">Promos</div>
            <div className="dropdown-item">Support</div>
            <div className="dropdown-item">Manage account</div>
            <div className="dropdown-item">Settings</div>
            <div className="dropdown-item">Billing</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
