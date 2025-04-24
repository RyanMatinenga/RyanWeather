import React from 'react';
import { getWeatherIcon, formatTime, dateBuilder } from '../utils/helpers';

const CurrentWeather = ({ weather }) => {
  if (!weather || !weather.main) return null;

  return (
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
    </div>
  );
};

export default CurrentWeather; 