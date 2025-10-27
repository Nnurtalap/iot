import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import TemperatureChart from '../components/TemperatureChart';

// 1. ИМПОРТИРУЕМ КОНСТАНТУ
import { API_URL } from '../apiConfig';

function SensorDetailPage() {
  const { id } = useParams();
  const { socket } = useOutletContext();
  const [sensorData, setSensorData] = useState(null);
  const [history, setHistory] = useState([]);
  const [range, setRange] = useState('1h');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // 2. ИСПОЛЬЗУЕМ ЕЕ
        const res = await axios.get(`${API_URL}/api/sensors/${id}/history`, {
          params: { range } 
        });
        setSensorData({ 
            name: res.data.name, 
            unit: res.data.unit, 
            value: res.data.history[res.data.history.length - 1].value 
        });
        setHistory(res.data.history);
      } catch (e) { 
        console.error("Датчик не найден", e);
        setSensorData(null); 
      }
    };
    fetchHistory();
  }, [id, range]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (updates) => {
      const myUpdate = updates.find(s => s.id === id);
      if (myUpdate) {
        if (range === '1h') {
          setHistory((prevData) => {
            const timeLabel = myUpdate.timestamp.split('T')[1].split('.')[0].slice(3);
            const newPoint = { time: timeLabel, value: myUpdate.value };
            return [...prevData.slice(1), newPoint];
          });
        }
        setSensorData(prev => ({...prev, value: myUpdate.value}));
      }
    };
    socket.on('sensor_updates', handleUpdate);
    return () => {
      socket.off('sensor_updates', handleUpdate);
    };
  }, [id, socket, range]);

  if (!sensorData) {
    return (
        <div>
            <Link to="/">&larr; Назад на главную</Link>
            <h2>Загрузка...</h2>
        </div>
    );
  }

  return (
    <div className="sensor-detail">
      <Link to="/">&larr; Назад на главную</Link>
      <h1>{sensorData.name}</h1>
      <span className="temp-value" style={{fontSize: '2.5rem', margin: '1rem 0', display: 'block'}}>
        Текущее: {sensorData.value.toFixed(1)} {sensorData.unit}
      </span>
      <div className="range-selector">
        <button onClick={() => setRange('1h')} disabled={range === '1h'}>1 час</button>
        <button onClick={() => setRange('24h')} disabled={range === '24h'}>24 часа</button>
        <button onClick={() => setRange('7d')} disabled={range === '7d'}>7 дней</button>
      </div>
      <div className="chart-container">
        <h3>История (за {range})</h3>
        <TemperatureChart 
            data={history} 
            dataKey="value"
            unit={sensorData.unit} 
        />
      </div>
    </div>
  );
}
export default SensorDetailPage;