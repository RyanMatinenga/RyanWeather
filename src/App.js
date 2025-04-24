import React, { useState } from 'react';
const api = {
  key: "1fa9ff4126d95b8db54f3897a208e91c", // Working API key
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get weather icons based on weather code
  const getWeatherIcon = (code) => {
    if (code >= 200 && code < 300) return '⛈️'; // Thunderstorm
    if (code >= 300 && code < 400) return '🌧️'; // Drizzle
    if (code >= 500 && code < 600) return '🌧️'; // Rain
    if (code >= 600 && code < 700) return '❄️'; // Snow
    if (code >= 700 && code < 800) return '🌫️'; // Atmosphere
    if (code === 800) return '☀️'; // Clear
    if (code > 800) return '☁️'; // Clouds
    return '🌡️'; // Default
  };

  // Convert timestamp to 12-hour format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const search = evt => {
    console.log("Key pressed:", evt.key);
    if (evt.key === "Enter") {
      setIsLoading(true);
      setError(null);
      console.log("Enter key pressed, searching for:", query);
      
      // Get current weather
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => {
          console.log("API response status:", res.status);
          if (!res.ok) {
            throw new Error("City not found or API error");
          }
          return res.json();
        })
        .then(result => {
          console.log("API result:", result);
          setWeather(result);
          
          // Get 5-day forecast after we get current weather
          return fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`);
        })
        .then(res => {
          if (!res.ok) {
            throw new Error("Error fetching forecast data");
          }
          return res.json();
        })
        .then(forecastData => {
          console.log("Forecast data:", forecastData);
          
          // Process forecast data to get one forecast per day
          const dailyForecasts = [];
          const today = new Date().getDate();
          
          // Filter forecasts to get one entry per day (at noon)
          forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.getDate();
            
            // Skip today's forecasts
            if (day === today) return;
            
            // Check if we already have this day in our dailyForecasts
            const existingDay = dailyForecasts.find(f => 
              new Date(f.dt * 1000).getDate() === day
            );
            
            // If not in array yet, and we have less than 5 days, add it
            if (!existingDay && dailyForecasts.length < 5) {
              // Find the noon forecast for this day
              const noonForecast = forecastData.list.find(f => {
                const fDate = new Date(f.dt * 1000);
                return fDate.getDate() === day && fDate.getHours() >= 12 && fDate.getHours() <= 15;
              });
              
              // If found a noon forecast, use it, otherwise use the current one
              dailyForecasts.push(noonForecast || item);
            }
          });
          
          setForecast(dailyForecasts);
          setQuery('');
          setIsLoading(false);
        })
        .catch(error => {
          console.error("API error:", error);
          setError(error.message);
          setIsLoading(false);
        });
    }
  }

  const handleSearchClick = () => {
    // Create a fake keypress event with key="Enter"
    search({ key: "Enter" });
  };

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }
  
  // Get day name from timestamp
  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  }

  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="header">
          <h1>Ryan's Weather Reporter</h1>
          <p>Your reliable source for real-time weather updates</p>
        </div>
        
        <div className="search-container">
          <div className="search-box">
            <input 
              type="text"
              className="search-bar"
              placeholder="Search by city name..."
              onChange={e => setQuery(e.target.value)}
              value={query}
              onKeyDown={search}
            />
            <div className="search-icon" onClick={handleSearchClick}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="#666"/>
              </svg>
            </div>
          </div>
          <p className="search-prompt">Enter a city name and press Enter or click the search icon</p>
        </div>
        
        {isLoading && (
          <div className="loader">
            <p>Loading weather data...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please try another city name</p>
          </div>
        )}
        
        {(typeof weather.main != "undefined") ? (
        <div className="weather-container">
          <div className="location-box">
            <div className="location">{weather.name}, {weather.sys.country}</div>
            <div className="date">{dateBuilder(new Date())}</div>
          </div>
          
          <div className="weather-box">
            <div className="weather-icon">
              {getWeatherIcon(weather.weather[0].id)}
            </div>
            <div className="temp">
              {Math.round(weather.main.temp)}°c
            </div>
            <div className="weather">{weather.weather[0].main}</div>
            <div className="weather-description">{weather.weather[0].description}</div>
          </div>
          
          <div className="weather-details">
            <div className="detail">
              <span>Feels Like</span>
              <p>{Math.round(weather.main.feels_like)}°c</p>
            </div>
            <div className="detail">
              <span>Humidity</span>
              <p>{weather.main.humidity}%</p>
            </div>
            <div className="detail">
              <span>Wind</span>
              <p>{Math.round(weather.wind.speed)} m/s</p>
            </div>
          </div>
          
          <div className="extended-details">
            <div className="detail-item">
              <span>Pressure</span>
              <p>{weather.main.pressure} hPa</p>
            </div>
            <div className="detail-item">
              <span>Visibility</span>
              <p>{(weather.visibility / 1000).toFixed(1)} km</p>
            </div>
            <div className="detail-item">
              <span>Sunrise</span>
              <p>{formatTime(weather.sys.sunrise)}</p>
            </div>
            <div className="detail-item">
              <span>Sunset</span>
              <p>{formatTime(weather.sys.sunset)}</p>
            </div>
          </div>
          
          {forecast.length > 0 && (
            <div className="forecast-section">
              <h2>5-Day Forecast</h2>
              <div className="forecast-container">
                {forecast.map((day, index) => (
                  <div className="forecast-day" key={index}>
                    <div className="forecast-date">{getDayName(day.dt)}</div>
                    <div className="forecast-icon">{getWeatherIcon(day.weather[0].id)}</div>
                    <div className="forecast-temp">
                      <span className="max">{Math.round(day.main.temp_max)}°</span>
                      <span className="min">{Math.round(day.main.temp_min)}°</span>
                    </div>
                    <div className="forecast-desc">{day.weather[0].main}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        ) : (
          !isLoading && !error && (
            <div className="welcome-message">
              <p>Welcome to Ryan's Weather Reporter</p>
              <p>Search for a city to get started</p>
            </div>
          )
        )}
        
        <footer className="footer">
          <p>© 2024 Ryan's Weather Reporter | Powered by OpenWeatherMap</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
