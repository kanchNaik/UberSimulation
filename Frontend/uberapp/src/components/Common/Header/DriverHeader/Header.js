// Header.js
import React from "react";
import "./HeaderStyles.css";

const Header = () => {
    return (
        <header className="header">
            <div className="logo">Uber Driver</div>
            <nav className="nav">
                <ul>
                    <li><a href="#home">Home</a></li>
                    <li><a href="#pasttrips">Past Trips</a></li>
                    <li><a href="#get-started">Get Started</a></li>
                    <li><a href="#profile">My Profile</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
