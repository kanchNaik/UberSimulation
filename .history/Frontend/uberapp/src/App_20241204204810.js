import React from "react";
import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import store from './store';

//All components import
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";

import CustomerSignup from "./components/Auth/Signup/CustomerSignup";
import DriverSignup from "./components/Auth/Signup/DriverSignup";
import Driver from "./components/Home/Driver";
import DriverHome from "./components/Home/DriverHome";
import PaymentList from "./components/Payments/PaymentList";
import AddPaymentMethod from "./components/Payments/AddPaymentMethod";
import CustomerProfile from "./components/UserProfile/CustomerProfile";
import DriverProfile from "./components/UserProfile/DriverProfile";
import TripList from "./components/DriverDashboard/TripList";

window.store = store;

function App() {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <div className="main-content">
        <Routes> 
          <Route path="/" element={<Navigate to="/uberhome" replace />} />
          <Route path="/customer/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/driver" element={<Driver/>} />
          <Route path="/driver/home" element={<DriverHome />} />
          <Route path="/customer/manageaccount/:id" element={<CustomerProfile />} />
          <Route path="/driver/trips" element={<TripList />} />

          <Route path="/driver/signup" element={<DriverSignup />} />
          <Route path="/customer/payments" element={<PaymentList />} />
          <Route path="/customer/payments/add" element={<AddPaymentMethod />} />
          <Route path="/driver/manageaccount/:id" element={<DriverProfile />} />
          <Route path="*" element={<h1>404 Not Found</h1>}/>
        </Routes>
        </div>
      </div>
    </>
  );
}

export default App;