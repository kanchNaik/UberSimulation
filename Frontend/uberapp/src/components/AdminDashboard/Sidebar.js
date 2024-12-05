import React, { useState } from "react";
import "./Sidebar.css";
import { FaBars, FaUser, FaCar, FaReceipt, FaCog, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-container">
      {/* Menu Icon */}
      <div className="menu-icon" onClick={toggleSidebar}>
        <FaBars />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div>
          <h2>Uber Admin</h2>
          <ul>
            <li>
              <Link to="/admin/dashboard">
                <MdDashboard className="icon" /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/usersinfo">
                <FaUser className="icon" /> Users
              </Link>
            </li>
            <li>
              <Link to="/admin/driversinfo">
                <FaCar className="icon" /> Drivers
              </Link>
            </li>
            <li>
              <Link to="/admin/ridesinfo">
                <FaReceipt className="icon" /> Rides
              </Link>
            </li>
          </ul>
        </div>
        <div>
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
