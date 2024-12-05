import React from "react";
import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import store from './store';

//All components import
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login/Login";
import Dashboard from "./components/AdminDashboard/Dashboard";
import CustomerSignup from "./components/Auth/Signup/CustomerSignup";
import DriverSignup from "./components/Auth/Signup/DriverSignup";
import Driver from "./components/Home/Driver";
import DriverHome from "./components/Home/DriverHome";
import AdminHome from "./components/Home/AdminHome";
import PaymentList from "./components/Payments/PaymentList";
import AddPaymentMethod from "./components/Payments/AddPaymentMethod";
import CustomerProfile from "./components/UserProfile/CustomerProfile";
import DriverProfile from "./components/UserProfile/DriverProfile";
import TripsList from "./components/Rider/Trips/TripsList";
import Billing from "./components/Rider/Billing/Billing";  
import Users from "./components/AdminDashboard/Filter/Users";
import Drivers from "./components/AdminDashboard/Filter/Drivers";
import Rides from "./components/AdminDashboard/Filter/Rides";
import AddCustomer from "./components/Auth/AdminAuth/AddCustomer";
import AddDriver from "./components/Auth/AdminAuth/AddDriver";
import AddAdmin from "./components/Auth/AdminAuth/AddAdmin";
import Bills from "./components/AdminDashboard/Filter/Bills";
import UberHome from "./components/Home/UberHome";
import Signup from "./components/Auth/Signup/Signup";
window.store = store;

function App() {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <div className="main-content">
        <Routes> 
        
          <Route path="/" element={<Navigate to="/uberhome" replace />} />

          {/* Auth Routes  */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Customer Routes */} 
          <Route path="/customer/home" element={<Home />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/customer/manageaccount/:id" element={<CustomerProfile />} />
          <Route path="/customer/trips" element={<TripsList />} />
          <Route path="/customer/billing" element={<Billing />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/usersinfo" element={<Users />} />
          <Route path="/admin/driversinfo" element={<Drivers />} />
          <Route path="/admin/ridesinfo" element={<Rides />} />
          <Route path="/admin/add-driver" element={<AddDriver />} />
          <Route path="/admin/add-customer" element={<AddCustomer />} />
          <Route path="/admin/add-admin" element={<AddAdmin />} />
          <Route path="/admin/billsinfo" element={<Bills />} />
          <Route path="/logout" element={<Navigate to="/uberhome" replace />} />
          <Route path="/driver/signup" element={<DriverSignup />} />
          <Route path="/customer/payments" element={<PaymentList />} />
          <Route path="/customer/payments/add" element={<AddPaymentMethod />} />

          {/* Driver Routes */}
          <Route path="/driver" element={<Driver/>} />
          <Route path="/driver/home" element={<DriverHome />} />
          <Route path="/driver/signup" element={<DriverSignup />} />
          <Route path="/driver/manageaccount/:id" element={<DriverProfile />} />
          <Route path="/uberhome" element={<UberHome />} />
          <Route path="*" element={<h1>404 Not Found</h1>}/>
        </Routes>
        </div>
      </div>
    </>
  );
}

export default App;