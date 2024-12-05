import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import "./Dashboard.css";
import Cookies from "js-cookie";
import { BASE_API_URL } from "../../Setupconstants";

const AdminDashboard = () => {
  const [timePeriod, setTimePeriod] = useState("Day");
  const [dashboardData, setDashboardData] = useState({
    revenue_per_unit: [],
    rides_per_area: [],
    rides_per_driver: [],
    total_rides: 0,
    total_revenue: 0,
    avg_rides_per_customer: 0,
    avg_rides_per_driver: 0,
    total_active_drivers: 0,
    total_active_customers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [openWeatherApiKey] = useState("YOUR_OPENWEATHER_API_KEY");

  const token = Cookies.get("access_token");

  const getCityName = async (lat, lon) => {
    try {
      const response = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${openWeatherApiKey}`);
      const data = await response.json();
      return data[0]?.name || `${lat}, ${lon}`;
    } catch (error) {
      console.error("Error fetching city name:", error);
      return `${lat}, ${lon}`;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/administrator/statistics/report?timePeriod=${timePeriod}`,
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
        
        // Fetch city names for each area
        const ridesPerAreaWithCityNames = await Promise.all(
          data.rides_per_area.map(async (item) => {
            const cityName = await getCityName(item.pickup_location__latitude, item.pickup_location__longitude);
            console.log(cityName);
            return { ...item, area_name: cityName };
          })
        );

        setDashboardData({
          ...data,
          rides_per_area: ridesPerAreaWithCityNames,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timePeriod, openWeatherApiKey, token]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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

        <div className="time-period-filter">
          {["Day", "Week", "Month", "Year"].map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`time-period-button ${timePeriod === period ? "active" : ""}`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="chart-container" style={{ height: "400px", width: "90%" }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Line
              data={{
                labels: dashboardData.revenue_per_unit.map(item => item.time_unit),
                datasets: [
                  {
                    label: `Revenue (${timePeriod})`,
                    data: dashboardData.revenue_per_unit.map(item => item.total_revenue),
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

        <div className="chart-container" style={{ height: "400px", width: "90%" }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Bar
              data={{
                labels: dashboardData.rides_per_area.map(item => item.area_name),
                datasets: [
                  {
                    label: `Rides Per Area (${timePeriod})`,
                    data: dashboardData.rides_per_area.map(item => item.total_rides),
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

        <div className="chart-container" style={{ height: "400px", width: "90%" }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Pie
              data={{
                labels: dashboardData.rides_per_driver.map(item => `${item.driver__first_name} ${item.driver__last_name}`),
                datasets: [
                  {
                    label: `Rides Per Driver (${timePeriod})`,
                    data: dashboardData.rides_per_driver.map(item => item.total_rides),
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
              options={chartOptions}
            />
          )}
        </div>

        <div className="metrics">
          <MetricCard title="Total Rides" value={dashboardData.total_rides} />
          <MetricCard title="Total Revenue" value={`$${dashboardData.total_revenue}`} />
          <MetricCard title="Avg Rides per Customer" value={dashboardData.avg_rides_per_customer.toFixed(2)} />
          <MetricCard title="Avg Rides per Driver" value={dashboardData.avg_rides_per_driver.toFixed(2)} />
          <MetricCard title="Total Active Drivers" value={dashboardData.total_active_drivers} />
          <MetricCard title="Total Active Customers" value={dashboardData.total_active_customers} />
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
