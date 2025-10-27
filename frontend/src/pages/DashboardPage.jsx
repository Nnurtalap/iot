import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useOutletContext } from 'react-router-dom';
import SensorGauge from '../components/SensorGauge';
import { X, Signal, AlertTriangle, Settings2, PlusCircle, Trash2 } from 'lucide-react';

// 1. ИМПОРТИРУЕМ КОНСТАНТУ
import { API_URL } from '../apiConfig';

const LogIcon = ({ type }) => {
  switch (type) {
    case 'data': return <Signal size={16} />;
    case 'alert': return <AlertTriangle size={16} />;
    case 'settings': return <Settings2 size={16} />;
    case 'create': return <PlusCircle size={16} />;
    case 'delete': return <Trash2 size={16} />;
    default: return <Signal size={16} />;
  }
};

function DashboardPage() {
  const { socket } = useOutletContext();
  const [sensors, setSensors] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        // 2. ИСПОЛЬЗУЕМ ЕЕ
        const res = await axios.get(`${API_URL}/api/sensors`); 
        const sensorsObject = res.data.reduce((acc, sensor) => {
          acc[sensor.id] = sensor;
          return acc;
        }, {});
        setSensors(sensorsObject);
      } catch (error) {
        console.error("Ошибка загрузки датчиков:", error);
      }
    };
    fetchSensors();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('sensor_updates', (updates) => {
      setSensors((prevSensors) => {
        const newSensors = { ...prevSensors };
        updates.forEach(sensor => {
          if (newSensors[sensor.id]) {
            newSensors[sensor.id] = { ...newSensors[sensor.id], value: sensor.value };
          }
        });
        return newSensors;
      });
    });
    socket.on('sensor_created', (newSensor) => {
      setSensors((prev) => ({ ...prev, [newSensor.id]: newSensor }));
    });
    socket.on('sensor_deleted', (deletedId) => {
      setSensors((prevSensors) => {
        const newSensors = { ...prevSensors };
        delete newSensors[deletedId];
        return newSensors;
      });
    });
    socket.on('sensor_settings_updated', (updatedSettings) => {
      setSensors((prevSensors) => {
        const newSensors = { ...prevSensors };
        if (newSensors[updatedSettings.id]) {
          newSensors[updatedSettings.id] = { 
            ...newSensors[updatedSettings.id], 
            ...updatedSettings 
          };
        }
        return newSensors;
      });
    });
    socket.on('log_event', (newEvent) => {
      setLogs((prevLogs) => [
        {...newEvent, id: Math.random()}, 
        ...prevLogs
      ].slice(0, 50));
    });
    return () => {
      socket.off('sensor_updates');
      socket.off('sensor_created');
      socket.off('sensor_deleted');
      socket.off('sensor_settings_updated');
      socket.off('log_event');
    };
  }, [socket]);

  const handleDelete = async (id, event) => {
    event.preventDefault(); 
    event.stopPropagation();
    if (window.confirm(`Вы уверены, что хотите удалить датчик ${id}?`)) {
      try {
        // 3. ИСПОЛЬЗУЕМ ЕЕ
        await axios.delete(`${API_URL}/api/sensors/${id}`);
      } catch (error) {
        console.error('Ошибка при удалении датчика:', error);
      }
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="main-content">
        <h1>Обзор Системы</h1>
        <div className="sensor-list">
          {Object.values(sensors).map(sensor => (
            <Link to={`/sensor/${sensor.id}`} key={sensor.id} className="sensor-card-link">
              <div className="current-temp-card">
                <button 
                  className="delete-sensor-btn"
                  title={`Удалить ${sensor.name}`}
                  onClick={(e) => handleDelete(sensor.id, e)}
                > <X size={16} /> </button>
                <h3>
                  <span 
                    className={`status-dot ${sensor.alertEnabled ? 'active' : ''}`}
                    title={sensor.alertEnabled ? 'Оповещения включены' : 'Оповещения выключены'}
                  ></span>
                  <span>{sensor.name}</span>
                </h3>
                <SensorGauge 
                  value={sensor.value} 
                  unit={sensor.unit}
                />
              </div>
            </Link>
          ))}
          {Object.keys(sensors).length === 0 && (
            <p>Датчики не найдены. Перейдите в "Настройки", чтобы добавить новый.</p>
          )}
        </div>
      </div>
      <div className="sidebar-right">
        <div className="log-container">
          <h3>Журнал Событий</h3>
          <div className="log-list">
            {logs.length === 0 && (
              <div className="log-item log-item-data" style={{color: '#777'}}>
                Подключение к серверу...
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className={`log-item log-item-${log.type}`}>
                <span className="log-icon"><LogIcon type={log.type} /></span>
                <span className="log-message">{log.message}</span>
                <span className="log-time">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashboardPage;