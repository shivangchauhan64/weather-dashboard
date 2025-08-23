import fetch from "node-fetch";

import { getCached, setCached, addFavorite, removeFavorite, getFavorites } from '../models/database.js';

const weatherController = {
  getWeather: async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City is required" });

    const cached = getCached("current", city, process.env.CACHE_TTL_CURRENT);
    if (cached) return res.json(cached);

    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== 200) {
        return res.status(404).json({ error: data.message });
      }

      const weatherData = {
        city: data.name,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      };
      setCached("current", city, weatherData);
      res.json(weatherData);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },

  getForecast: async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "City is required" });

    const cached = getCached("forecast", city, process.env.CACHE_TTL_FORECAST);
    if (cached) return res.json(cached);

    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod !== "200") {
        return res.status(404).json({ error: data.message });
      }

      const daily = [];
      const seenDays = new Set();
      data.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!seenDays.has(date)) {
          seenDays.add(date);
          daily.push({
            date: date,
            temp: item.main.temp,
            condition: item.weather[0].description,
            humidity: item.main.humidity,
            wind: item.wind.speed,
            pop: item.pop * 100,
          });
        }
      });

      setCached("forecast", city, daily.slice(0, 5));
      res.json(daily.slice(0, 5));
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },

  getFavorites: (req, res) => {
    const favorites = getFavorites();
    res.json(favorites);
  },

  addFavorite: (req, res) => {
    const { city } = req.body;
    if (!city) return res.status(400).json({ error: "City required" });
    try {
      addFavorite(city);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "DB error" });
    }
  },

  removeFavorite: (req, res) => {
    const { city } = req.body;
    if (!city) return res.status(400).json({ error: "City required" });
    removeFavorite(city);
    res.json({ success: true });
  },

  getGeocode: async (req, res) => {
    const q = req.query.q;
    if (!q) return res.status(400).json([]);
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (err) {
      res.status(500).json([]);
    }
  },

  getReverse: async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({});
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data[0] || {});
    } catch (err) {
      res.status(500).json({});
    }
  }
};

export default weatherController;