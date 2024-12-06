// Header.js
import React from "react";
import "./HeaderStyles.css";

const Header = () => {
    return (
        <header className="header">
            <div className="logo"><a href="/driver/home">Uber Driver</a></div>
            <nav className="nav">
                <ul>
                    <li><a href="/driver/signup">Get Started</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
