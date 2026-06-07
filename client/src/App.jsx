import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import Alerts from "./pages/Alerts";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <WeatherProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </Layout>
      </WeatherProvider>
    </BrowserRouter>
  );
}
