import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css"; // Import your CSS
import Cookies from "js-cookie";
import { BASE_API_URL } from "../../Setupconstants"; // Replace with your actual constants file

const AdminDashboard = () => {
  const [timePeriod, setTimePeriod] = useState("Day");
  const [dashboardData, setDashboardData] = useState({
    revenue: [],
    timeLabels: [],
    ridesPerArea: [],
    ridesPerDriver: [],
    ridesPerCustomer: [],
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    revenueSummary: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("access_token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/admin/dashboard?timePeriod=${timePeriod}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        setDashboardData({
          revenue: data.revenue,
          timeLabels: data.timeLabels,
          ridesPerArea: data.ridesPerArea,
          ridesPerDriver: data.ridesPerDriver,
          ridesPerCustomer: data.ridesPerCustomer,
          totalUsers: data.totalUsers,
          totalDrivers: data.totalDrivers,
          totalRides: data.totalRides,
          revenueSummary: data.revenueSummary,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timePeriod]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: "#000" },
      },
    },
    scales: {
      x: { ticks: { color: "#000" } },
      y: { ticks: { color: "#000" } },
    },
  };

  return (
    <div className="admin-dashboard-container">
      <Sidebar />
      <div className="dashboard-main-content">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        {/* Time Period Filter */}
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Line
              data={{
                labels: dashboardData.timeLabels,
                datasets: [
                  {
                    label: `Revenue (${timePeriod})`,
                    data: dashboardData.revenue,
                    borderColor: "#FF9800",
                    backgroundColor: "rgba(255, 152, 0, 0.2)",
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={chartOptions}
            />
          )}
        </div>

        {/* Rides Per Area */}
        <div className="chart-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Bar
              data={{
                labels: dashboardData.ridesPerArea.map((item) => item.area),
                datasets: [
                  {
                    label: `Rides Per Area (${timePeriod})`,
                    data: dashboardData.ridesPerArea.map((item) => item.count),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={chartOptions}
            />
          )}
        </div>

        {/* Rides Per Driver */}
        <div className="chart-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Pie
              data={{
                labels: dashboardData.ridesPerDriver.map(
                  (item) => `Driver ${item.driverId}`
                ),
                datasets: [
                  {
                    label: `Rides Per Driver (${timePeriod})`,
                    data: dashboardData.ridesPerDriver.map((item) => item.count),
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                      "#9966FF",
                    ],
                  },
                ],
              }}
            />
          )}
        </div>

        {/* Rides Per Customer */}
        <div className="chart-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Bar
              data={{
                labels: dashboardData.ridesPerCustomer.map(
                  (item) => `Customer ${item.customerId}`
                ),
                datasets: [
                  {
                    label: `Rides Per Customer (${timePeriod})`,
                    data: dashboardData.ridesPerCustomer.map((item) => item.count),
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={chartOptions}
            />
          )}
        </div>

        {/* Metrics */}
        <div className="metrics">
          <MetricCard title="Total Users" value={dashboardData.totalUsers} />
          <MetricCard title="Total Drivers" value={dashboardData.totalDrivers} />
          <MetricCard title="Total Rides" value={dashboardData.totalRides} />
          <MetricCard title="Revenue" value={`$${dashboardData.revenueSummary}`} />
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
