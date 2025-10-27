import React from 'react';
import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import SensorDetailPage from './pages/SensorDetailPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import ArchitecturePage from './pages/ArchitecturePage';
import './App.css';

// 1. ИМПОРТИРУЕМ КОНСТАНТУ
import { API_URL } from './apiConfig';

// 2. ИСПОЛЬЗУЕМ ЕЕ
const socket = io(API_URL);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout socket={socket} />}>
        <Route index element={<DashboardPage />} /> 
        <Route path="sensor/:id" element={<SensorDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
export default App;