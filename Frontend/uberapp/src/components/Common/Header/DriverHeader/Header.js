// Header.js
import React from "react";
import "./HeaderStyles.css";
import { useAuth } from '../../../../AuthContext';
import { useNavigate  } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../../../actionType";
const Header = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const dispatch = useDispatch();

    const handleLogout = () => {
        logout();
        dispatch({ type: LOGOUT });
        navigate('/login');
    }
    return (
        <header className="header">
            <div className="logo"><a href="/driver/home">Uber Driver</a></div>
            <nav className="nav">
                <ul>
                    <li onClick={handleLogout}>Logout</li>
                    <li><a href="/driver/signup">Get Started</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
