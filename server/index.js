import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import weatherController from './controllers/weatherController.js'; // Default import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5050;

// Routes
app.get('/weather', weatherController.getWeather);
app.get('/forecast', weatherController.getForecast);
app.get('/favorites', weatherController.getFavorites);
app.post('/favorites/add', weatherController.addFavorite);
app.post('/favorites/remove', weatherController.removeFavorite);
app.get('/geocode', weatherController.getGeocode);
app.get('/reverse', weatherController.getReverse);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));