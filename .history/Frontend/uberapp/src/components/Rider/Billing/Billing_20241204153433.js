.billing-page {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}

/* Full-width header styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: white;
  border-bottom: 1px solid #ddd;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.nav ul li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-icon {
  font-size: 24px;
  cursor: pointer;
}

.billing-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #d2d2d2;
  border-radius: 8px;
  background-color: #ffffff;
}

.header-content {
  border-bottom: 2px solid #d2d2d2;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

h2 {
  color: #0055A2;
  margin-bottom: 5px;
}

h3 {
  color: #E5A823;
  margin-top: 10px;
}

.billing-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.trip-info {
  grid-column: span 2;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.driver-info {
  display: flex;
  align-items: center;
}

.driver-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.map img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.trip-summary {
  margin-top: 20px;
}

.fare-breakdown, .trip-statistics {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.fare-breakdown p, .trip-statistics p {
  display: flex;
  justify-content: space-between;
}

hr {
  border: 0;
  height: 1px;
  background: #d2d2d2;
}

span {
  font-weight: bold;
}

.trip-filter-section {
  margin-top: 30px;
}

.filter-dropdown {
  position: relative;
  display: inline-block;
}

.filter-button {
  background-color: #0055A2;
  color: #ffffff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #ffffff;
  border: 1px solid #d2d2d2;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 200px;
  z-index: 1;
}

.scrollable-dropdown {
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-menu div {
  padding: 10px;
  cursor: pointer;
}

.dropdown-menu div:hover {
  background-color: #f0f0f0;
}