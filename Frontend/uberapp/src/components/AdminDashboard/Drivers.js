import React from "react";

const Drivers = () => {
  const drivers = [
    { id: 1, name: "Mike Johnson", vehicle: "Toyota Prius", rating: 4.8 },
    { id: 2, name: "Sara Davis", vehicle: "Honda Civic", rating: 4.7 },
  ];

  return (
    <div className="drivers-container">
      <h1>Drivers</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Vehicle</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.id}</td>
              <td>{driver.name}</td>
              <td>{driver.vehicle}</td>
              <td>{driver.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Drivers;
