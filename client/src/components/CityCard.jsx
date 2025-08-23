import React from 'react';

const CityCard = ({ city, weatherData, selectCity, getWeatherIcon }) => {
  if (!weatherData) return null;

  return (
    <div
      className="bg-gray-100 dark:bg-card-bg p-3 md:p-4 rounded-lg cursor-pointer text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      onClick={() => selectCity(city)}
    >
      <h4 className="font-semibold text-sm md:text-base">{city}</h4>
      <p className="text-xl md:text-2xl">
        {weatherData.temp}°C {getWeatherIcon(weatherData.condition)}
      </p>
      <p className="text-xs md:text-sm capitalize">{weatherData.condition}</p>
    </div>
  );
};

export default CityCard;