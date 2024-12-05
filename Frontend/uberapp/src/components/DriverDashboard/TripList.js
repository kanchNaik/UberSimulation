// TripList.js
import React, { useState, useEffect } from "react";
import "./TripListStyles.css";

const TripList = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/driver/trips");
                if (!response.ok) {
                    throw new Error("Failed to fetch trips");
                }
                const data = await response.json();
                setTrips(data);
            } catch (error) {
                console.error("Error fetching trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    return (
        <div className="trip-list">
            <h2>Recent Trips</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Pickup</th>
                            <th>Drop-off</th>
                            <th>Fare</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map((trip) => (
                            <tr key={trip.id}>
                                <td>{trip.pickup}</td>
                                <td>{trip.dropoff}</td>
                                <td>${trip.fare}</td>
                                <td>{trip.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TripList;
