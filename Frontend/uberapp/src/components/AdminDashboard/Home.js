import React from 'react';
import './Home.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">Welcome to Uber Admin Page</h1>
      <div className="card-container">
        <Card
          title="Add Admin"
          description="Manage administrative tasks and roles."
          icon="👤"
        />
        <Card
          title="Add Customer"
          description="Add new customers to the platform."
          icon="🚗"
        />
        <Card
          title="Add Driver"
          description="Onboard new drivers for services."
          icon="🚖"
        />
      </div>
    </div>
  );
};

const Card = ({ title, description, icon }) => {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      <button className="card-button">Add</button>
    </div>
  );
};

export default HomePage;
