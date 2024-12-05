import React, { useState, useEffect } from "react";
import "./TripListStyles.css";

const TripList = ({ trips, loading }) => {
    const [formattedTrips, setFormattedTrips] = useState([]);

    useEffect(() => {
        const formatTrips = async () => {
            const formattedTrips = await Promise.all(trips.map(async (trip) => {
                const pickupAddress = await getAddress(trip.pickup);
                const dropoffAddress = await getAddress(trip.dropoff);
                return { ...trip, pickupAddress, dropoffAddress };
            }));
            setFormattedTrips(formattedTrips);
        };

        if (!loading && trips.length > 0) {
            formatTrips();
        }
    }, [trips, loading]);

    const getAddress = async (coordinates) => {
        const [lat, lng] = coordinates.split(',').map(coord => coord.split(':')[1].trim());
        const apiKey = 'AIzaSyDy_J3z6fxdYPmT0OXFNodkpbH-bC8mbUY';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].formatted_address;
            }
            return 'Address not found';
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Error fetching address';
        }
    };

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
                        {formattedTrips.map((trip) => (
                            <tr key={trip.ride_id}>
                                <td>{trip.pickupAddress}</td>
                                <td>{trip.dropoffAddress}</td>
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