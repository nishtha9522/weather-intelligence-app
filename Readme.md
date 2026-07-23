# Weather Intelligence Web Application

A modern, responsive Weather Intelligence Web Application built using React, TypeScript, Vite, and Tailwind CSS. The app fetches real-time weather and 7-day forecast data from the public Open-Meteo API.

---

## 🌟 Key Features

* **City Search:** Search weather conditions for any city globally with real-time loading feedback.
* **Current Weather:** View current temperature (°C), weather conditions, and wind speed.
* **7-Day Forecast:** Daily minimum and maximum temperature cards for upcoming days.
* **Smart Planning Recommendations:** Simple contextual tips based on live weather conditions.
* **Robust Error Handling:** Clear error feedback for invalid city searches and network issues.

---

## 🔌 API Information

This app integrates public endpoints provided by Open-Meteo (no API keys required):

* **Geocoding API:** `https://geocoding-api.open-meteo.com/v1/search` (Converts city name to latitude/longitude)
* **Forecast API:** `https://api.open-meteo.com/v1/forecast` (Fetches current weather and daily 7-day forecast)

---

## 🛠️ Local Development & Build Instructions

### Prerequisites
* Node.js (v18 or higher)
* npm

### Setup Steps
1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/weather-intelligence-app.git](https://github.com/YOUR_USERNAME/weather-intelligence-app.git)
   cd weather-intelligence-app
