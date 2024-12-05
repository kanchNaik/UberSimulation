// Dashboard.js
import React, { useState, useEffect } from "react";
import TripList from "./TripList";
import Earnings from "./Earnings";
import AvailabilityToggle from "./AvailabilityToggle";
import Support from "./Support";
import "./DashboardStyles.css";
import { BASE_API_URL } from '../../Setupconstants';
import { messageService } from '../Common/Message/MessageService';
import Cookies from 'js-cookie';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_trips: 0,
        total_earnings: 0,
        average_rating: 0,
        recent_trips: [],
        earnings_breakdown: {
            daily: 0,
            weekly: 0,
            monthly: 0
        }
    });
    const [loading, setLoading] = useState(true);

    const id = Cookies.get('user_id');
    const token = Cookies.get('access_token');
    console.log(id);

    useEffect(() => {
        // Fetch data from backend API
        const fetchStats = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/api/drivers/${id}/stats`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                if (!response.ok) {
                    throw new Error("Failed to fetch stats");
                }
                const data = await response.json();
                setStats(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
                messageService.showMessage('error', 'Error fetching stats');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    console.log("Stats:", stats);
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
                        <p>{stats.total_trips}</p>
                    </div>
                    <div className="stat">
                        <h3>Total Earnings</h3>
                        <p>${stats.total_earnings}</p>
                    </div>
                    <div className="stat">
                        <h3>Average Rating</h3>
                        <p>{stats.average_rating}</p>
                    </div>
                </section>
            )}
            <TripList 
                trips={stats.recent_trips} />
            <Earnings 
                earnings={stats.earnings_breakdown}
                loading={loading}
            />
            <AvailabilityToggle />
            <Support />
        </div>
    );
};

export default Dashboard;
