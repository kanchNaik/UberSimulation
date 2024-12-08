import React, { useState, useEffect } from "react";
import Header from "../Common/Header/CustomerHeader/Header";
import RideForm from "../Common/Ride/RideForm";
import Map from "../Common/Map/Map";
import ChooseRide from "../Rider/ChooseRide/ChooseRide";
import WebSocketService from '../../services/websocket';

function Home() {
  const [showChooseRide, setShowChooseRide] = useState(false);
  const [locations, setLocations] = useState({
    pickup: { address: '', lat: null, lng: null },
    dropoff: { address: '', lat: null, lng: null }
  });
  const [driverLocations, setDriverLocations] = useState([]);

  // WebSocket connection for real-time driver locations
  useEffect(() => {
    const ws = new WebSocketService();
    ws.connect();
    
    ws.addCallback('driverLocations', (data) => {
      try {
        console.log("data: ", data)
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        if (parsedData.type === 'driver_locations') {
          setDriverLocations(parsedData.drivers);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    return () => {
      ws.removeCallback('driverLocations');
      if (ws.websocket) {
        ws.websocket.close();
      }
    };
  }, []);

  const handleLocationSelect = (type, place) => {
    if (place.geometry) {
      setLocations(prev => ({
        ...prev,
        [type]: {
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }));
    }
  };

  const handleSearchClick = () => {
    if (locations.pickup.lat && locations.dropoff.lat) {
      setShowChooseRide(true);
    } else {
      alert('Please select both pickup and dropoff locations');
    }
  };

  const handleCloseChooseRide = () => {
    setShowChooseRide(false);
  };

  return (
    <>
      <Header />
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "20px",
        gap: "20px",
      }}>
        <RideForm 
          onLocationSelect={handleLocationSelect}
          onSearch={handleSearchClick}
          locations={locations}
        />
        <Map 
          pickupLocation={locations.pickup}
          dropoffLocation={locations.dropoff}
          driverLocations={driverLocations}
        />
      </div>

      {showChooseRide && (
        <ChooseRide 
          onClose={handleCloseChooseRide}
          pickupLocation={locations.pickup}
          dropoffLocation={locations.dropoff}
        />
      )}
    </>
  );
}

export default Home;
