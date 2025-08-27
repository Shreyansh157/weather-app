import express from "express";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const __dirname = import.meta.dirname;

// OpenWeatherMap API key (you'll need to get your own free API key)
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Check if API key is provided
if (!API_KEY) {
  console.error("❌ Error: OPENWEATHER_API_KEY not found in environment variables");
  console.log("📝 Please add your OpenWeatherMap API key to the .env file");
  process.exit(1);
}

// Set view engine and static files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.render("index", { weather: null, error: null });
});

app.post("/weather", async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.render("index", {
      weather: null,
      error: "Please enter a city name",
    });
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      windSpeed: response.data.wind.speed,
      feelsLike: Math.round(response.data.main.feels_like),
      visibility: response.data.visibility / 1000, // Convert to km
    };

    res.render("index", { weather: weatherData, error: null });
  } catch (error) {
    let errorMessage = "City not found. Please check the spelling and try again.";

    if (error.response && error.response.status === 401) {
      errorMessage = "Invalid API key. Please check your OpenWeatherMap API key.";
    }

    res.render("index", { weather: null, error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Weather app listening on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the app`);
});
