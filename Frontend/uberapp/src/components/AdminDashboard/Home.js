import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './Home.css';
import AddAdmin from '../Auth/AdminAuth/AddAdmin';
const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to Uber Admin Page</h1>
      <div className="card-container">
        <Card
          title="Add Admin"
          description="Manage administrative tasks and roles."
          icon="👤"
          link="/admin/add-admin" // Link to Add Admin page
        />
        <Card
          title="Add Customer"
          description="Add new customers to the platform."
          icon="🚗"
          link="/admin/add-customer" // Link to Add Customer page
        />
        <Card
          title="Add Driver"
          description="Onboard new drivers for services."
          icon="🚖"
          link="/admin/add-driver" // Link to Add Driver page
        />
      </div>
    </div>
  );
};

const Card = ({ title, description, icon, link }) => {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      <Link to={link}>
        <button className="card-button">Add</button>
      </Link>
    </div>
  );
};

export default HomePage;
