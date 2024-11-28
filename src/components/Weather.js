import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("Toronto");
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch forecast data from OpenWeatherMap API
  const fetchForecast = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&units=metric`
      );

      // Filter data to display one forecast per day (12:00 PM)
      const dailyForecast = response.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );

      setForecastData(dailyForecast);
      setError(null);
    } catch (err) {
      setError("City not found.");
    }
  };

  useEffect(() => {
    fetchForecast(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    const inputCity = e.target.elements.city.value.trim();
    if (inputCity) setCity(inputCity);
  };

  return (
    <div className="weather-container">
      <div className="search-container">
        <h1>5-Day Weather Forecast</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="city"
            placeholder="Enter city"
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="forecast-container">
        {forecastData.map((day, index) => (
          <div className="forecast-card" key={index}>
            <h3>{new Date(day.dt_txt).toLocaleDateString()}</h3>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
            <p>{day.weather[0].description}</p>
            {/* Round the temperature to the nearest whole number */}
            <p>Temp: {Math.round(day.main.temp)}°C</p>
            <p>Humidity: {day.main.humidity}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
