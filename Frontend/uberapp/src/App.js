import React from "react";
import Header from "./components/Header";
import RideForm from "./components/RideForm";
import Map from "./components/Map";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <Header />
        <div className="main-content">
          <RideForm />
          <Map />
        </div>
      </div>
    </>
  );
}

export default App;
