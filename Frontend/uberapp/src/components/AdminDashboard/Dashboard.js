import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css"; // Import the merged CSS

const AdminDashboard = () => {
  const [timePeriod, setTimePeriod] = useState("Day"); // Default time period is "Day"

  // Dummy data for revenue
  const revenueData = {
    Day: [200, 300, 250, 400, 350, 300, 450], // Example revenue for a week
    Week: [1500, 1700, 1800, 2000],
    Month: [8000, 9500, 10000],
    Year: [105000, 120000, 135000],
  };

  const timeLabels = {
    Day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    Week: ["Week 1", "Week 2", "Week 3", "Week 4"],
    Month: ["Jan", "Feb", "Mar"],
    Year: ["2021", "2022", "2023"],
  };

  // Chart.js configuration
  const chartData = {
    labels: timeLabels[timePeriod],
    datasets: [
      {
        label: `Revenue (${timePeriod})`,
        data: revenueData[timePeriod],
        borderColor: "#FF9800",
        backgroundColor: "rgba(255, 152, 0, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#000",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#000" },
      },
      y: {
        ticks: { color: "#000" },
      },
    },
  };

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="dashboard-main-content">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        {/* Filter Bar for Time Period */}
        <div className="time-period-filter">
          {["Day", "Week", "Month", "Year"].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`time-period-button ${
                timePeriod === period ? "active" : ""
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Metrics */}
        <div className="metrics">
          <MetricCard title="Total Users" value="24,563" />
          <MetricCard title="Total Drivers" value="1,234" />
          <MetricCard title="Total Rides" value="45,678" />
          <MetricCard title="Revenue" value="$123,456" />
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Uber Admin</h2>
      <ul className="sidebar-menu">
        <li>Dashboard</li>
        <li>Users</li>
        <li>Drivers</li>
        <li>Rides</li>
        <li>Settings</li>
        <li>Logout</li>
      </ul>
    </div>
  );
};

const MetricCard = ({ title, value }) => {
  return (
    <div className="metric">
      <h2>{title}</h2>
      <p>{value}</p>
    </div>
  );
};

export default AdminDashboard;
