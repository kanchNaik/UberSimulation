import React, { useState, useEffect } from 'react';
import { data } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';

const KafkaConsumer = () => {
  const [driverLocations, setDriverLocations] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      // Create WebSocket connection
      const socket = new WebSocket('ws://127.0.0.1:8000/ws/drivers/');

      // Set up WebSocket event listeners
      socket.onopen = () => {
          setConnected(true);
          console.log("WebSocket connection established.");
      };

      socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("Message from server: ", data["message"]);
          updateDrivers(data["message"]);  // Store the received message in state
      };

      socket.onerror = (event) => {
          console.error("WebSocket error: ", event);
          setError("Error connecting to WebSocket");
      };

      socket.onclose = (event) => {
          setConnected(false);
          console.log("WebSocket connection closed: ", event);
      };

      // Cleanup WebSocket connection on component unmount
      return () => {
          socket.close();
      };
  }, []);  // Empty dependency array ensures this effect runs only once on mount

  const updateDrivers = (message) => {
    setDriverLocations((prevDriverLocations) => {
      const driverIndex = prevDriverLocations.findIndex(d => d.driver_id === message.driver_id);

      if (message.status === "not available") {
        // Remove driver if not available
        if (driverIndex !== -1) {
          const updatedDrivers = [...prevDriverLocations];
          updatedDrivers.splice(driverIndex, 1);
          return updatedDrivers;
        }
      } else {
        if (driverIndex !== -1) {
          // Update existing driver
          const updatedDrivers = [...prevDriverLocations];
          updatedDrivers[driverIndex] = { ...updatedDrivers[driverIndex], lat: message.lat, lon: message.lon };
            return updatedDrivers;
        } else {
          // Add new driver
          return [...prevDriverLocations, { driver_id: message.driver_id, lat: message.lat, lon: message.lon }];
        }
      }
      return prevDriverLocations;
    });
  };


  return (
      <div>
          <h2>Driver WebSocket</h2>
          {connected ? (
              <p>WebSocket is connected.</p>
          ) : (
              <p>WebSocket is disconnected.</p>
          )}

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {data && (
              <div>
                  <h3>Received Message</h3>
                  <pre>{JSON.stringify(data["message"], null, 2)}</pre>
              </div>
          )}
      </div>
  );
};

export default KafkaConsumer;