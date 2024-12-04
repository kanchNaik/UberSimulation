import React from "react";
import Header from "./components/Common/Header/CustomerHeader/Header";
import RideForm from "./components/Common/Ride/RideForm";
import Map from "./components/Common/Map/Map";
import GlobalStyles from "./styles/GlobalStyles";
import Trips from "./components/Rider/Trips/TripsList";

function App() {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <div className="main-content">
          {/* <Header /> */}
          {/* <RideForm />
          <Map /> */}
          <TripsList/>
        </div>
      </div>
    </>
  );
}

export default App;


// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import GlobalStyles from "./styles/GlobalStyles";

// // Components
// import Header from "./components/Common/Header/CustomerHeader/Header"; // Corrected import path
// import Trips from "./components/Rider/Trips/Trips";
// import Home from "./components/Home/Home"; // Optional: a default home component

// function App() {
//   return (
//     <BrowserRouter>
//       <GlobalStyles />
//       <div className="App">
//         <Header />
//         <div className="main-content">
//           <Routes>
//             {/* Define routes */}
//             <Route path="/" element={<Home />} /> {/* Default home page */}
//             <Route path="/trips" element={<Trips />} />
//           </Routes>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
