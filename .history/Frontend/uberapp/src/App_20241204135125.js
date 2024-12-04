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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/Common/Header/CustomerHeader/Header";
import Trips from "./components/Rider/Trips/Trips";
import Home from "./components/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header /> {/* Header displayed on all pages */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

