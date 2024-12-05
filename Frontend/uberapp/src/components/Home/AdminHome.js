import React from 'react';
import Sidebar from '../AdminDashboard/Sidebar';
import HomePage from '../AdminDashboard/Home';
function AdminHome() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <HomePage />
    </div>
  )
}

export default AdminHome