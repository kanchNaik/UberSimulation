import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Correct imports
import GlobalStyles from "./styles/GlobalStyles";

// All components import
import Home from "./components/Home/Home";
import Trips from "./components/Rider/Trips/Trips";

function App() {
  return (
    <BrowserRouter> {/* Add BrowserRouter wrapper */}
      <GlobalStyles />
      <div className="App">
        <div className="main-content">
          <Routes> 
            {/* Default route redirects to /uberhome */}
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
