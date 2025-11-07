import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export function TempChart({ data }) {
  const formatted = data.time.slice(0, 24).map((t, i) => ({
    time: t.split("T")[1],
    temp: data.temperature_2m[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="temp" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function WindChart({ data }) {
  const formatted = data.time.slice(0, 24).map((t, i) => ({
    time: t.split("T")[1],
    wind: data.wind_speed_10m[i],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="wind" stroke="#007bff" />
      </LineChart>
    </ResponsiveContainer>
  );
}
