import React, { useState } from "react";
import "./RideFormStyles.css";

const RideForm = ({ onLocationSelect, onSearch, locations }) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [timeOption, setTimeOption] = useState("Pickup now");
  const [suggestions, setSuggestions] = useState({
    pickup: [],
    dropoff: []
  });

  const searchLocation = async (query, type) => {
    if (!query.trim()) {
      setSuggestions({ ...suggestions, [type]: [] });
      return;
    }

    try {
      const response = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?apiKey=${process.env.REACT_APP_HERE_API_KEY}&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      
      const formattedSuggestions = data.items.map(item => ({
        address: item.address.label,
        position: {
          lat: item.position.lat,
          lng: item.position.lng
        }
      }));

      setSuggestions({ ...suggestions, [type]: formattedSuggestions });
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions({ ...suggestions, [type]: [] });
    }
  };

  const handleLocationInput = (e, type) => {
    const value = e.target.value;
    if (type === 'pickup') {
      setPickup(value);
    } else {
      setDropoff(value);
    }
    searchLocation(value, type);
  };

  const handleSuggestionSelect = (suggestion, type) => {
    if (type === 'pickup') {
      setPickup(suggestion.address);
    } else {
      setDropoff(suggestion.address);
    }
    onLocationSelect(type, {
      formatted_address: suggestion.address,
      geometry: {
        location: {
          lat: () => suggestion.position.lat,
          lng: () => suggestion.position.lng
        }
      }
    });
    setSuggestions({ ...suggestions, [type]: [] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="ride-form-container">
      <h3 className="ride-form-title">Get a ride</h3>
      <form className="ride-form" onSubmit={handleSubmit}>
        <div className="location-input-container">
          <input
            type="text"
            placeholder="Pickup location"
            value={pickup}
            onChange={(e) => handleLocationInput(e, 'pickup')}
          />
          {suggestions.pickup.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.pickup.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion, 'pickup')}
                >
                  {suggestion.address}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="location-input-container">
          <input
            type="text"
            placeholder="Dropoff location"
            value={dropoff}
            onChange={(e) => handleLocationInput(e, 'dropoff')}
          />
          {suggestions.dropoff.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.dropoff.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionSelect(suggestion, 'dropoff')}
                >
                  {suggestion.address}
                </li>
              ))}
            </ul>
          )}
        </div>

        <select
          value={timeOption}
          onChange={(e) => setTimeOption(e.target.value)}
        >
          <option>Pickup now</option>
          <option>Schedule for later</option>
        </select>
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default RideForm;
