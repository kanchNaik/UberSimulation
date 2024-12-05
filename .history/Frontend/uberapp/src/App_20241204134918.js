import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import Header from "./components/Common/Header/Header"; // Global header
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
