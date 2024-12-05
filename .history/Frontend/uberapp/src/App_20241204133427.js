import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";

// Components
import Home from "./components/Home/Home";
import Trips from "./components/Rider/Trips/Trips";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <div className="App">
        <div className="main-content">
          <Routes>
            {/* Redirect from "/" to "/uberhome" */}
            <Route path="/" element={<Navigate to="/uberhome" replace />} />
            <Route path="/uberhome" element={<Home />} />
            <Route path="/trips" element={<Trips />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
