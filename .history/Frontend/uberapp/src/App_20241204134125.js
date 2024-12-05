import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";

// Components
import Header from "./components/Common/Header/CustomerHeader/Header"; // Corrected import path
import RideForm from "./components/Common/Ride/RideForm";
import Map from "./components/Common/Map/Map";
import Trips from "./components/Rider/Trips/Trips";
import Home from "./components/Home/Home"; // Optional: a default home component

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <div className="App">
        <Header />
        <div className="main-content">
          <Routes>
            {/* Define routes */}
            <Route path="/" element={<Home />} /> {/* Default home page */}
            <Route path="/ride-form" element={<RideForm />} />
            <Route path="/map" element={<Map />} />
            <Route path="/trips" element={<Trips />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
