import { useEffect, useState } from "react";
import "./App.css";
import { cities } from "./data.js";

export default function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchWeather = async () => {
      const results = await Promise.all(
        cities.map(async (city) => {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
          );
          const data = await res.json();
          return {
            name: city.name,
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            weathercode: data.current_weather.weathercode,
          };
        })
      );
      setWeatherData(results);
    };
    fetchWeather();
  }, []);

  const getCondition = (code) => {
    if ([0].includes(code)) return "Clear";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
    if ([61, 63, 65, 66, 67].includes(code)) return "Rainy";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
    if ([80, 81, 82].includes(code)) return "Showers";
    if ([95, 96, 99].includes(code)) return "Stormy";
    return "Unknown";
  };

  const filtered = weatherData.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" || getCondition(city.weathercode) === filter;
    return matchesSearch && matchesFilter;
  });

  const avgTemp =
    weatherData.length > 0
      ? (
          weatherData.reduce((sum, c) => sum + c.temperature, 0) /
          weatherData.length
        ).toFixed(1)
      : 0;
  const maxTemp = Math.max(...weatherData.map((c) => c.temperature), 0);
  const minTemp = Math.min(...weatherData.map((c) => c.temperature), 0);

  return (
    <div className="App">
      <h1>🌤️ Weather Dashboard</h1>

      <div className="stats">
        <p><strong>Average Temp:</strong> {avgTemp}°C</p>
        <p><strong>Highest Temp:</strong> {maxTemp}°C</p>
        <p><strong>Lowest Temp:</strong> {minTemp}°C</p>
      </div>

      <div className="controls">
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Conditions</option>
          <option value="Clear">Clear</option>
          <option value="Partly Cloudy">Partly Cloudy</option>
          <option value="Rainy">Rainy</option>
          <option value="Snowy">Snowy</option>
          <option value="Stormy">Stormy</option>
          <option value="Foggy">Foggy</option>
          <option value="Drizzle">Drizzle</option>
          <option value="Showers">Showers</option>
        </select>
      </div>

      <ul className="city-list">
        {filtered.map((c) => (
          <li key={c.name} className="city-item">
            <div className="info">
              <h3>{c.name}</h3>
              <p>{getCondition(c.weathercode)}</p>
            </div>
            <div className="metrics">
              <p>🌡 {c.temperature}°C</p>
              <p>💨 {c.windspeed} km/h</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
