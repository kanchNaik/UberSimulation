// Earnings.js
import React, { useState, useEffect } from "react";
import "./EarningsStyles.css";

const Earnings = () => {
    const [earnings, setEarnings] = useState({ daily: 0, weekly: 0, monthly: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/driver/earnings");
                if (!response.ok) {
                    throw new Error("Failed to fetch earnings data");
                }
                const data = await response.json();
                setEarnings(data);
            } catch (error) {
                console.error("Error fetching earnings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, []);

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

