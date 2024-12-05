import React, { useState } from "react";
import { FaGlobe, FaChevronDown } from "react-icons/fa";
import "./UberHeaderStyles.css";

const UberHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">Uber</div>

      {/* Navigation */}
      <nav className="nav">
        <ul className="nav-links">
          <li>Ride</li>
          <li>Drive</li>
          <li>Business</li>
          <li>Uber Eats</li>
          <li className="dropdown">
            About
            <FaChevronDown className="dropdown-icon" />
          </li>
        </ul>
      </nav>

      {/* Profile & Options */}
      <div className="options">
        <div className="language">
          <FaGlobe className="globe-icon" />
          <span>EN</span>
        </div>
        <a href="/help" className="help-link">
          Help
        </a>
        <a href="/login" className="login-link">
          Log in
        </a>
        <a href="/signup" className="signup-btn">
          Sign up
        </a>
      </div>
    </header>
  );
};

export default UberHeader;
