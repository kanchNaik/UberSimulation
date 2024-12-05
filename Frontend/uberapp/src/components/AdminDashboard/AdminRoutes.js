import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import AddAdmin from '../Auth/AdminAuth/AddAdmin';
import AddDriver from '../Auth/AdminAuth/AddDriver';
import AddCustomer from '../Auth/AdminAuth/AddCustomer';

const AdminRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/add-driver" element={<AddDriver />} />
                <Route path="/admin/add-customer" element={<AddCustomer />} />
                <Route path="/admin/add-admin" element={<AddAdmin />} />
            </Routes>
        </Router>
    );
};

export default AdminRoutes;
