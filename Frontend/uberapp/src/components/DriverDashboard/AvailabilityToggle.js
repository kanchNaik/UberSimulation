import React, { useState, useEffect } from "react";
import "./AvailabilityToggleStyles.css";
import Cookies from 'js-cookie';
import { BASE_API_URL } from '../../Setupconstants';

const AvailabilityToggle = ({ driverId }) => {
    const [isOnline, setIsOnline] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const id = Cookies.get('user_id');
    const token = Cookies.get('access_token');

    useEffect(() => {
        // Fetch initial availability status
        fetchAvailabilityStatus();
    }, []);

    const fetchAvailabilityStatus = async () => {
        try {
            const response = await fetch(`${BASE_API_URL}/api/drivers/${id}/getstatus`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            setIsOnline(data);
        } catch (error) {
            console.error("Error fetching availability status:", error);
        }
    };

    const toggleAvailability = async () => {
        setIsLoading(true);
        try {
            const endpoint = isOnline ? 'setdeactive' : 'setactive';
            const response = await fetch(`${BASE_API_URL}/api/drivers/${id}/${endpoint}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setIsOnline(!isOnline);
            } else {
                console.error("Error toggling availability:", data.error);
            }
        } catch (error) {
            console.error("Error toggling availability:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="availability-toggle">
            <h2>Availability</h2>
            <button
                className={`toggle-button ${isOnline ? "online" : "offline"}`}
                onClick={toggleAvailability}
                disabled={isLoading}
            >
                {isLoading ? "Updating..." : (isOnline ? "Go Offline" : "Go Online")}
            </button>
        </div>
    );
};

export default AvailabilityToggle;