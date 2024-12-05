import React from 'react';
import './HeaderStyles.css';

const Header = () => {
    return (
        <header className="header">
            <h1>Welcome, Admin</h1>
            <button className="logout-button">Logout</button>
        </header>
    );
};

export default Header;
