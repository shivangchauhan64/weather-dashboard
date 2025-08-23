Weather Dashboard — Vite (React) + Express + SQLite
A simple full-stack weather app that displays current weather, 5-day daily forecast, and hourly forecast for added cities. Features a responsive UI with dark/light mode, favorites management, and geolocation for initial city suggestion.
Tech Stack

Frontend: Vite + React + Tailwind CSS
Backend: Node.js + Express + node-fetch
Database: SQLite (via better-sqlite3) for caching and favorites
Caching: SQLite-based TTL cache on the server to minimize external API calls
Weather Source: OpenWeatherMap (Geocoding + Current Weather + 5-day/3-hour Forecast API)
Error Handling: HTTP error responses; frontend error messages and empty states

Project Structure
weather-dashboard-vite-express/
├─ src/               # React app source
│  ├─ components/     # Reusable components (Sidebar, WeatherCard, CityCard)
│  └─ App.jsx         # Main app logic
├─ server/            # Express API + SQLite
│  ├─ controllers/    # Weather controller logic
│  ├─ models/         # Database model
│  └─ index.js        # Server entry point
├─ tailwind.config.js # Tailwind configuration
├─ package.json       # Dependencies and scripts
├─ .env               # Environment variables (API key, etc.)
└─ README.md

Quick Start (Local)

Create an OpenWeatherMap API key (free tier) and add it to .env in the server directory.
WEATHER_API_KEY=your_api_key_here
PORT=5050
CACHE_TTL_CURRENT=600   # 10 minutes
CACHE_TTL_FORECAST=3600 # 1 hour


Install Dependencies:

For backend (in /server):npm install


For frontend (in root or /client if separated):npm install




Run Backend:
cd server
npm run dev  # or node --watch index.js

Server runs on http://localhost:5050.

Run Frontend:
npm run dev  # Vite server on http://localhost:5173 (proxies API to :5050)



Deploy

Backend: Deploy to Render, Railway, or Heroku. Set env vars in the platform. Note: SQLite uses a local file (data.db); for persistent storage on serverless platforms, consider migrating to PostgreSQL or a cloud database.
Frontend: Deploy to Netlify or Vercel. Update API_BASE in App.jsx to your deployed backend URL.
CORS is enabled on the API for cross-origin requests.

API (Backend)
Base: / (e.g., http://localhost:5050/weather?city=London)

GET /weather?city=<city_name>: Current weather for a city. Returns { city, temp, feels_like, condition, humidity, wind, sunrise, sunset }.
GET /forecast?city=<city_name>: 5-day daily and next 24-hour (3-hour intervals) forecast. Returns { daily: [{ date, temp, condition, humidity, wind, pop }], hourly: [{ dt, temp, condition, pop }] }.
GET /favorites: List of favorite cities.
POST /favorites/add: Body { city: "<city_name>" } – Adds a city to favorites.
POST /favorites/remove: Body { city: "<city_name>" } – Removes a city from favorites.
GET /geocode?q=<query>: City suggestions for search (geocoding).
GET /reverse?lat=<lat>&lon=<lon>: Reverse geocoding for current location.

Caching is applied to /weather (10 min) and /forecast (1 hour) via SQLite.
Frontend Features

Search & Add Cities: Autocomplete suggestions via geocoding; preview weather before adding.
Favorites: Persistent list of cities; remove with ×.
Current Weather Card: Temp, condition, feels like, humidity, wind, sunrise/sunset.
5-Day Forecast: Daily cards with temp, condition, rain %.
Hourly Forecast: Next 24 hours (3-hour intervals) with temp, condition, rain %.
Dark/Light Mode: Toggle with persistence via classList.
Geolocation: Auto-suggests current city if no favorites.
Responsive: Mobile-friendly layout (stacked on small screens).
Error Handling: Messages for invalid cities or fetch errors.

Assumptions

Single-user app; no authentication.
Units fixed to metric (°C, km/h).
Hourly forecast shows next 8 intervals (24 hours) from OpenWeatherMap's 3-hour data.
Geolocation requires user permission.

Known Limitations

No charts (e.g., for hourly trends); simple grid display.
Cache resets if DB is cleared; TTL-based expiration.
No i18n or unit toggles.

Future Improvements

Add auth for multi-user favorites.
Use Recharts for hourly temperature/precipitation charts.
Persist dark mode and units in localStorage.
Add loading spinners/skeletons.
Unit tests for components and API.

Enjoy the app!