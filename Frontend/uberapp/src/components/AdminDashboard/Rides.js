import React from "react";

const Rides = () => {
  const rides = [
    { id: 1, driver: "Mike Johnson", customer: "John Doe", fare: "$25" },
    { id: 2, driver: "Sara Davis", customer: "Jane Smith", fare: "$30" },
  ];

  return (
    <div className="rides-container">
      <h1>Rides</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Driver</th>
            <th>Customer</th>
            <th>Fare</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride) => (
            <tr key={ride.id}>
              <td>{ride.id}</td>
              <td>{ride.driver}</td>
              <td>{ride.customer}</td>
              <td>{ride.fare}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rides;
