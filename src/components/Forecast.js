import React from 'react';
import { getWeatherIcon, getDayName } from '../utils/helpers';

const Forecast = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
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
  );
};

export default Forecast; 