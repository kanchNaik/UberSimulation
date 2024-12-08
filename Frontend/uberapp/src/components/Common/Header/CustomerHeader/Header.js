import React, { useState } from "react";
import { FaCar, FaBox, FaUserCircle, FaChevronDown } from "react-icons/fa";
import "./HeaderStyles.css";
import { NavLink } from "react-router-dom";
import cookies from "js-cookie";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const user_id = cookies.get("user_id");

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
      <div className="profile">
        <a href="/customer/trips" className="profile-link">
          <span>My trips</span>
        </a>
        <FaUserCircle className="profile-icon" aria-label="Profile icon" />
        <FaChevronDown
          className="chevron-icon"
          aria-label="Dropdown icon"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item">Wallet</div>
            <div className="dropdown-item">Promos</div>
            <div className="dropdown-item">Support</div>
            <div>
            <NavLink
            to={`/customer/manageaccount/${user_id}`}
            className="dropdown-item"
            role="menuitem"
            aria-label="Manage account link"
          >
            Manage account
          </NavLink></div>
            <div className="dropdown-item">Settings</div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
