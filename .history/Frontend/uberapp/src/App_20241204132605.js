import React from "react";
import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter as Route, Routes, Navigate } from 'react-router-dom';


//All components import
import Home from "./components/Home/Home";

function App() {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <div className="main-content">
        <Routes> 
          <Route path="/" element={<Navigate to="/uberhome" replace />} />
          <Route path="/uberhome" element={<Home />} />
        </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
