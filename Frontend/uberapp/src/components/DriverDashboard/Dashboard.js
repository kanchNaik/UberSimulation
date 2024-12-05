// Dashboard.js
import React, { useState, useEffect } from "react";
import TripList from "./TripList";
import Earnings from "./Earnings";
import AvailabilityToggle from "./AvailabilityToggle";
import Support from "./Support";
import "./DashboardStyles.css";

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalTrips: 0,
        totalEarnings: 0,
        averageRating: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from backend API
        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/driver/stats");
                if (!response.ok) {
                    throw new Error("Failed to fetch stats");
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Driver Dashboard</h1>
            </header>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <section className="dashboard-overview">
                    <div className="stat">
                        <h3>Total Trips</h3>
                        <p>{stats.totalTrips}</p>
                    </div>
                    <div className="stat">
                        <h3>Total Earnings</h3>
                        <p>${stats.totalEarnings}</p>
                    </div>
                    <div className="stat">
                        <h3>Average Rating</h3>
                        <p>{stats.averageRating}</p>
                    </div>
                </section>
            )}
            <TripList />
            <Earnings />
            <AvailabilityToggle />
            <Support />
        </div>
    );
};

export default Dashboard;
