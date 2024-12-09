// Home.js
import React, { useState, useEffect } from "react";
import Header from "../Common/Header/CustomerHeader/Header";
import RideForm from "../Common/Ride/RideForm";
import Map from "../Common/Map/Map";
import ChooseRide from "../Rider/ChooseRide/ChooseRide";
import WebSocketService from '../../services/websocket';

function Home() {
  const [showChooseRide, setShowChooseRide] = useState(false);
  const [locations, setLocations] = useState({
    pickup: { address: '', city: '', lat: null, lng: null, title: '' },
    dropoff: { address: '', city: '', lat: null, lng: null, title: '' }
  });
  const [driverLocations, setDriverLocations] = useState([]);

  useEffect(() => {
    const ws = new WebSocketService();
    ws.connect();
    
    ws.addCallback('driverLocations', (data) => {
      try {
        console.log("data: ", data);
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

  const handleLocationSelect = (type, locationData) => {
    setLocations(prev => ({
      ...prev,
      [type]: {
        address: locationData.address,
        city: locationData.city,
        lat: locationData.lat,
        lng: locationData.lng,
        title: locationData.title
      }
    }));
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