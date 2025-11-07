import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cities } from "./data.js";
import { TempChart, WindChart } from "./Charts.jsx";

export default function CityDetail() {
    const { name } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const city = cities.find((c) => c.name === name);
        if (city) {
            const fetchCity = async () => {
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&hourly=temperature_2m,precipitation,wind_speed_10m`
                );
                const json = await res.json();
                setData({
                    name: city.name,
                    hourly: json.hourly
                });     
            };
            fetchCity();
        }
    }, [name]);

    if (!data) return <p>Loading...</p>;

    return (
        <div style={{ padding: "2rem", background: "#eef6fb" }}>
        <h1>{data.name} — Detailed Weather</h1>
        <Link to="/">← Back to Dashboard</Link>
        <div style={{ marginTop: "2rem"}}>
            <h3>Hourly Temperature (next 24 h)</h3>
            <TempChart data={data.hourly} />
            <h3>Hourly Wind Speed (next 24 h)</h3>
            <WindChart data={data.hourly} />
        </div>
        </div>
    );
}