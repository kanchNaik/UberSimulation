import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import DriverList from '../Drivers/DriverList';
import AddCustomer from '../Customers/AddCustomer';
import PaymentList from '../Payments/PaymentList';

const AdminRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/drivers" element={<DriverList />} />
                <Route path="/admin/customers/add" element={<AddCustomer />} />
                <Route path="/admin/payments" element={<PaymentList />} />
            </Routes>
        </Router>
    );
};

export default AdminRoutes;
