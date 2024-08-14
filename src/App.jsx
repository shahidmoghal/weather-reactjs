import React, { useEffect, useState } from "react";
import './App.css';
import { FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiAlertTriangle } from 'react-icons/fi';

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiKey = "6c5764b7a2010a1d15b4d9df62be0d31"; 

  const fetchWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      setWeather(data);
      setLocation(""); // Clear the input field
    } catch (error) {
      setError(error.message);
      setWeather({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchWeather()
  },[])

  const renderWeatherIcon = (main) => {
    switch (main) {
      case 'Clear':
        return <FiSun />;
      case 'Clouds':
        return <FiCloud />;
      case 'Rain':
        return <FiCloudRain />;
      case 'Snow':
        return <FiCloudSnow />;
      default:
        return <FiCloud />;
    }
  };

  return (
    <div className="app">
      <div className="weather-container">
        <h1>Weather App</h1>
        <form onSubmit={fetchWeather}>
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <button type="submit">Get Weather</button>
        </form>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">
            <FiAlertTriangle size={24} />
            <p>{error}</p>
          </div>
        ) : weather.main && (
          <div className="weather-info">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <div className="weather-icon">
              {renderWeatherIcon(weather.weather[0].main)}
            </div>
            <p><strong>Temperature:</strong> {Math.round(weather.main.temp)} °C</p>
            <p><strong>Feels Like:</strong> {Math.round(weather.main.feels_like)} °C</p>
            <p><strong>Condition:</strong> {weather.weather[0].description}</p>
            <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;