import React, { useState } from "react";
import "./DriverSidebar.css"; // Updated styling for Sidebar
import { FaBars, FaUser, FaCar, FaReceipt, FaCog, FaSignOutAlt, FaHouseUser, FaHouzz, FaLaptopHouse } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Default state: closed

  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState); // Toggle sidebar state
  };

  return (
    <div className="sidebar-wrapper">
      {/* Menu Icon */}
      <div className="menu-icon" onClick={toggleSidebar}>
        <FaBars />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>
          ✖
        </button>

        <div className="sidebar-header">
          <h2>Welcome, Driver</h2>
        </div>

        <div className="sidebar-options">
          <ul>
          <li>
              <Link to="/driver">
                <FaLaptopHouse className="icon" /> Home
              </Link>
            </li>
            <li>
              <Link to={`/driver/manageaccount/${Cookies.get("user_id")}`}>
                <MdDashboard className="icon" /> Profile
              </Link>
            </li>
            <li>
              <Link to="/driver/dashboard">
                <FaUser className="icon" /> Dashboard
              </Link>
            </li>

            <li>
              <Link to="/driver/home">
                <FaCar className="icon" /> Accept Rides
              </Link>
            </li>
           
          </ul>
        </div>
        <div className="sidebar-footer">
          <ul>
            <li>
              <Link to="/settings">
                <FaCog className="icon" /> Settings
              </Link>
            </li>
            <li>
              <Link to="/logout">
                <FaSignOutAlt className="icon" /> Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
