import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import WeatherCard from './components/WeatherCard';
import CityCard from './components/CityCard';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://weather-dashboard-backend-gdte.onrender.com'; // Fixed to match backend

function App() {
  const [city, setCity] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const [previewCity, setPreviewCity] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    favorites.forEach(fetchWeather);
  }, [favorites]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchLocation = () => {
  if (favorites.length === 0) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`${API_BASE.replace(/\/+$/, '')}/reverse?lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data.name) {
            setPreviewCity(data.name);
            fetchWeather(data.name);
            fetchForecast(data.name);
          }
        } catch (err) {
          console.error('Geolocation fetch error:', err);
          setErrorMsg('Error fetching location');
          setTimeout(() => setErrorMsg(''), 3000);
        }
      },
      (err) => {
        console.error('Geolocation denied:', err);
        setErrorMsg('Geolocation permission denied');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    );
  }
};

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length > 2) {
        try {
          const res = await fetch(`${API_BASE}/geocode?q=${query}`);
          const data = await res.json();
          setSuggestions(data);
          if (data.length === 0) {
            setErrorMsg('No location found');
            setTimeout(() => setErrorMsg(''), 3000);
          } else {
            setErrorMsg('');
          }
        } catch (err) {
          setErrorMsg('Error fetching suggestions');
          setTimeout(() => setErrorMsg(''), 3000);
        }
      } else {
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(city);
  }, [city, fetchSuggestions]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_BASE}/favorites`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setErrorMsg('Error fetching favorites');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const fetchWeather = async (city) => {
    try {
      const res = await fetch(`${API_BASE}/weather?city=${city}`);
      if (!res.ok) throw new Error('Bad response');
      const data = await res.json();
      setWeatherData((prev) => ({ ...prev, [city]: data }));
    } catch (err) {
      console.error('Error fetching weather:', err);
    }
  };

  const fetchForecast = async (city) => {
    try {
      const res = await fetch(`${API_BASE}/forecast?city=${city}`);
      if (!res.ok) throw new Error('Bad response');
      const data = await res.json();
      setForecastData((prev) => ({ ...prev, [city]: data }));
    } catch (err) {
      console.error('Error fetching forecast:', err);
    }
  };

  const addCity = async (toAdd) => {
    const cityToAdd = toAdd || city;
    if (!cityToAdd || favorites.includes(cityToAdd)) return;
    try {
      const res = await fetch(`${API_BASE}/weather?city=${cityToAdd}`);
      if (!res.ok) throw new Error('Invalid city');
      await fetch(`${API_BASE}/favorites/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityToAdd }),
      });
      setFavorites((prev) => [...prev, cityToAdd]);
      setCity('');
      setPreviewCity(null);
      setSelectedCity(cityToAdd);
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Invalid location');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const removeCity = async (city) => {
    try {
      await fetch(`${API_BASE}/favorites/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });
      setFavorites((prev) => prev.filter((c) => c !== city));
      setWeatherData((prev) => { const { [city]: _, ...rest } = prev; return rest; });
      setForecastData((prev) => { const { [city]: _, ...rest } = prev; return rest; });
      if (selectedCity === city) setSelectedCity(null);
      if (previewCity === city) setPreviewCity(null);
    } catch (err) {
      console.error('Error removing city:', err);
    }
  };

  const selectCity = (city) => {
    setSelectedCity(city);
    setPreviewCity(null);
    if (!forecastData[city]) fetchForecast(city);
  };

  const selectSuggestion = (sugg) => {
    setCity('');
    setSuggestions([]);
    setPreviewCity(sugg.name);
    fetchWeather(sugg.name);
    fetchForecast(sugg.name);
  };

  const getWeatherIcon = (condition) => {
    if (condition.includes('cloud')) return '☁️';
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('thunder')) return '⛈️';
    if (condition.includes('snow')) return '❄️';
    return '☀️';
  };

  const displayCity = previewCity || selectedCity;
  const isPreview = previewCity && !favorites.includes(previewCity);

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg text-black dark:text-white flex flex-col md:flex-row">
      <Sidebar
        city={city}
        setCity={setCity}
        suggestions={suggestions}
        addCity={addCity}
        favorites={favorites}
        removeCity={removeCity}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        errorMsg={errorMsg}
        selectCity={selectCity}
        selectSuggestion={selectSuggestion}
      />
      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 gap-4 md:gap-6">
        {displayCity && weatherData[displayCity] ? (
          <WeatherCard
            city={displayCity}
            weatherData={weatherData[displayCity]}
            forecastData={forecastData[displayCity]}
            isPreview={isPreview}
            addCity={addCity}
            getWeatherIcon={getWeatherIcon}
          />
        ) : favorites.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <h2 className="text-xl md:text-2xl mb-4 text-center">Search for the weather in your current city or any other.</h2>
            <p className="text-sm md:text-base">Use the sidebar to add cities.</p>
            <button
              onClick={fetchLocation}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm md:text-base"
            >
              Use My Location
            </button>
          </div>
        ) : (
          <p className="col-span-full text-center text-sm md:text-base">Select a city to view details</p>
        )}
        {favorites.length > 0 && (
          <>
            <h3 className="col-span-full text-xl md:text-2xl font-bold mt-4 md:mt-6">Other Cities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {favorites.filter((fav) => fav !== displayCity).map((fav) =>
                weatherData[fav] ? (
                  <CityCard
                    key={fav}
                    city={fav}
                    weatherData={weatherData[fav]}
                    selectCity={selectCity}
                    getWeatherIcon={getWeatherIcon}
                  />
                ) : null
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;