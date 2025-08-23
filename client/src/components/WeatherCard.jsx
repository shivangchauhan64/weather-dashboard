import React from 'react';

const WeatherCard = ({ city, weatherData, forecastData, isPreview, addCity, getWeatherIcon }) => {
  if (!city || !weatherData) return null;

  return (
    <div className="col-span-full">
      <div className="bg-gray-100 dark:bg-card-bg p-4 md:p-6 rounded-2xl shadow-lg text-black dark:text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{city}</h2>
        <div className="flex items-center gap-4">
          <span className="text-5xl md:text-6xl">{getWeatherIcon(weatherData.condition)}</span>
          <div>
            <p className="text-4xl md:text-5xl">{weatherData.temp}°C</p>
            <p className="capitalize text-sm md:text-base">{weatherData.condition}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs md:text-sm">
          <p>Feels Like: {weatherData.feels_like}°C</p>
          <p>💧 Humidity: {weatherData.humidity}%</p>
          <p>💨 Wind: {weatherData.wind} km/h</p>
          <p>🌅 Sunrise: {new Date(weatherData.sunrise * 1000).toLocaleTimeString()}</p>
          <p>🌇 Sunset: {new Date(weatherData.sunset * 1000).toLocaleTimeString()}</p>
        </div>
        {isPreview && (
          <button
            onClick={() => addCity(city)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm md:text-base"
          >
            Add to Favorites
          </button>
        )}
      </div>
      {forecastData && (
        <div className="mt-4 md:mt-6">
          <h3 className="text-xl md:text-2xl font-bold mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {forecastData.map((day, idx) => (
              <div key={idx} className="bg-gray-100 dark:bg-card-bg p-3 md:p-4 rounded-lg text-center text-black dark:text-white">
                <p className="font-semibold text-sm md:text-base">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <span className="text-2xl md:text-3xl">{getWeatherIcon(day.condition)}</span>
                <p className="text-sm md:text-base">{day.temp}°C</p>
                <p className="text-xs md:text-sm">Rain: {day.pop}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;