import React, { useCallback, useRef } from "react";
import "./MapStyles.css";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

// Map container dimensions
const containerStyle = {
  width: "100%",
  height: "100%",
};

// Center of the map (San Jose, CA in this case)
const center = {
  lat: 37.3352, // Latitude
  lng: -121.8811, // Longitude
};

// Mock data for car locations
const carLocations = [
  { id: 1, lat: 37.337, lng: -121.884 },
  { id: 2, lat: 37.334, lng: -121.877 },
  { id: 3, lat: 37.336, lng: -121.889 },
  { id: 4, lat: 37.332, lng: -121.882 },
];

const Map = () => {
  // Load Google Maps API with your API key
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAxXTrRhMvi_D4YAxx-_cMj5C5AgVgVmFI", // Replace with your API key
  });

  const mapRef = useRef(null);

  // Set up callbacks for map load and unmount
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const onUnmount = useCallback(() => (mapRef.current = null), []);

  return isLoaded ? (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Place car markers on the map */}
        {carLocations.map((car) => (
          <Marker
            key={car.id}
            position={{ lat: car.lat, lng: car.lng }}
            icon={{
              url: "https://img.icons8.com/ios-filled/50/000000/car--v1.png", // Car icon
              scaledSize: new window.google.maps.Size(40, 40), // Icon size
            }}
          />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <p>Loading map...</p>
  );
};

export default Map;
