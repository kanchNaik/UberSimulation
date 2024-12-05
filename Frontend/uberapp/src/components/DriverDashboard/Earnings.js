// Earnings.js
import React, { useState, useEffect } from "react";
import "./EarningsStyles.css";

const Earnings = ({ earnings, loading }) => {
    return (
        <div className="earnings">
            <h2>Earnings Breakdown</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <p>Daily: ${earnings.daily}</p>
                    <p>Weekly: ${earnings.weekly}</p>
                    <p>Monthly: ${earnings.monthly}</p>
                </>
            )}
        </div>
    );
};

export default Earnings;

