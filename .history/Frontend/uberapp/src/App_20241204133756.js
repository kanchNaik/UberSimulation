import React from "react";
import Header from "./components/Common/Header/CustomerHeader/Header";
import RideForm from "./components/Common/Ride/RideForm";
import Map from "./components/Common/Map/Map";
import GlobalStyles from "./styles/GlobalStyles";
import T
function App() {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <div className="main-content">
          <Header />
          <RideForm />
          <Map />
          <Trips/>
        </div>
      </div>
    </>
  );
}

export default App;
