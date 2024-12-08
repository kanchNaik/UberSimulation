import React, { useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "./MapStyles.css";

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194, // San Francisco coordinates
};

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const Map = ({ pickupLocation, dropoffLocation, driverLocations = [] }) => {
  console.log("driverLocations: ", driverLocations)
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAxXTrRhMvi_D4YAxx-_cMj5C5AgVgVmFI", // Replace with your API key
  });

  const onLoad = useCallback(
    (map) => {
      if (pickupLocation?.lat && dropoffLocation?.lat) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend({ lat: pickupLocation.lat, lng: pickupLocation.lng });
        bounds.extend({ lat: dropoffLocation.lat, lng: dropoffLocation.lng });
        map.fitBounds(bounds);
      }
    },
    [pickupLocation, dropoffLocation]
  );

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={pickupLocation?.lat ? pickupLocation : defaultCenter}
        zoom={13}
        onLoad={onLoad}
      >
        {pickupLocation?.lat && (
          <Marker
            position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            title="Pickup Location"
          />
        )}

        {dropoffLocation?.lat && (
          <Marker
            position={{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            title="Dropoff Location"
          />
        )}

        {driverLocations.map((driver) => (
          <Marker
            key={driver.id}
            position={{ lat: driver.latitude, lng: driver.longitude }}
            icon={{
              url: "/car-icon.png",
              scaledSize: new window.google.maps.Size(32, 32),
            }}
            title={`Driver ${driver.driver_id}`}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
