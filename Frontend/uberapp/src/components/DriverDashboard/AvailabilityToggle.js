// AvailabilityToggle.js
import React, { useState } from "react";
import "./AvailabilityToggleStyles.css";

const AvailabilityToggle = () => {
    const [isOnline, setIsOnline] = useState(false);

    const toggleAvailability = () => {
        setIsOnline(!isOnline);
    };

    return (
        <div className="availability-toggle">
            <h2>Availability</h2>
            <button
                className={`toggle-button ${isOnline ? "online" : "offline"}`}
                onClick={toggleAvailability}
            >
                {isOnline ? "Go Offline" : "Go Online"}
            </button>
        </div>
    );
};

export default AvailabilityToggle;
