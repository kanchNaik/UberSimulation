// import React from "react";
// import Header from "./components/Common/Header/CustomerHeader/Header";
// import RideForm from "./components/Common/Ride/RideForm";
// import Map from "./components/Common/Map/Map";
// import GlobalStyles from "./styles/GlobalStyles";
// import Trips from "./components/Rider/Trips/Trips";
// function App() {
//   return (
//     <>
//       <GlobalStyles />
//       <div className="App">
//         <div className="main-content">
//           <Header />
//           {/* <RideForm />
//           <Map /> */}
//           <Trips/>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;


import React from "react";
import Header from "../../Common/Header/Header"; // Corrected import path
import "./Trips.css";

const Trips = () => {
  return (
    <>
      <Header />
      <div className="trips-section">
        <h2 className="trips-header">Past</h2>
        <div className="trips-content">
          <div className="trips-info">
            <p>You have not taken any rides yet, take your first ride</p>
            <button className="book-now-btn">Book now</button>
          </div>
          <div className="trips-image">
            <img
              src="/path-to-car-graphic.png"
              alt="Car Graphic"
              className="car-image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Trips;
