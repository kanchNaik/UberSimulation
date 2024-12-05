/* Ensure body and html take up the full height */
.body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9; /* Optional: Light background color */
}

.uber-trips-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.uber-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #eaeaea;
}

.uber-header h1 {
  font-size: 24px;
  margin-right: 20px;
}

.uber-header nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
  font-size: 16px;
}

.user-options {
  display: flex;
  align-items: center;
}

.user-options img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-left: 10px;
}

.uber-main {
  display: flex;
  flex: 1; /* Ensures this section fills available space */
  padding: 20px;
  box-sizing: border-box;
}

.past-trips {
  flex: 2; /* Takes up more space than the sidebar */
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.trip-banner {
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 200px; /* Fixed height for banner */
}

.trip-banner img {
  width: 200px;
  height: auto;
  margin-right: 20px;
}

.trip-info {
  display: flex;
  flex-direction: column;
}

.booknow-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.booknow-button:hover {
  background-color: #444;
}

.sidebar {
  flex: 1; /* Takes up less space than the past-trips section */
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.ride-promo h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.request-ride-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.request-ride-button:hover {
  background-color: #0056b3;
}
