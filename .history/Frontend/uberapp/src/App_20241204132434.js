import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Common/Header/Header";
import RideForm from "./components/Ride/RideForm";
import Map from "./components/Map/Map";
import GlobalStyles from "./styles/GlobalStyles";
import Trips from "./components/Trips/Trips";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <div className="App">
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<RideForm />} />
            <Route path="/map" element={<Map />} />
            <Route path="/trips" element={<Trips />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
