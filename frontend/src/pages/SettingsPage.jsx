import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddSensorModal from '../components/AddSensorModal';
import { toast } from 'react-hot-toast'; 
import { Plus, Save, Bell, BellOff } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// 1. ИМПОРТИРУЕМ КОНСТАНТУ
import { API_URL } from '../apiConfig';

function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sensors, setSensors] = useState([]);
  const { socket } = useOutletContext();

  useEffect(() => {
    fetchSensors();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleSettingsUpdate = (updatedSensor) => {
      setSensors(prevSensors => 
        prevSensors.map(s => 
          s.id === updatedSensor.id ? { ...s, ...updatedSensor } : s
        )
      );
    };
    socket.on('sensor_settings_updated', handleSettingsUpdate);
    socket.on('new_sensor', fetchSensors);
    socket.on('sensor_deleted', fetchSensors);
    return () => {
      socket.off('sensor_settings_updated', handleSettingsUpdate);
      socket.off('new_sensor', fetchSensors);
      socket.off('sensor_deleted', fetchSensors);
    };
  }, [socket]);

  const fetchSensors = async () => {
    try {
      // 2. ИСПОЛЬЗУЕМ ЕЕ
      const res = await axios.get(`${API_URL}/api/sensors`);
      setSensors(res.data);
    } catch (error) {
      console.error("Ошибка загрузки датчиков:", error);
    }
  };

  const handleAddSensor = async (sensorData) => {
    try {
      // 3. ИСПОЛЬЗУЕМ ЕЕ
      await axios.post(`${API_URL}/api/sensors`, sensorData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Ошибка при добавлении датчика:', error);
      alert(`Ошибка: ${error.response?.data?.error || 'Не удалось добавить датчик'}`);
    }
  };

  const handleSettingChange = (id, field, value) => {
    setSensors(prevSensors => 
      prevSensors.map(sensor => 
        sensor.id === id ? { ...sensor, [field]: value } : sensor
      )
    );
  };

  const handleSaveSettings = async (id) => {
    const sensor = sensors.find(s => s.id === id);
    if (!sensor) return;
    try {
      // 4. ИСПОЛЬЗУЕМ ЕЕ
      await axios.put(`${API_URL}/api/sensors/${id}/settings`, {
        min: sensor.min,
        max: sensor.max,
        alertEnabled: sensor.alertEnabled
      });
      toast.success(`Настройки для ${sensor.name} сохранены!`);
    } catch (error) {
      console.error("Ошибка сохранения настроек:", error);
      toast.error("Ошибка сохранения");
    }
  };

  return (
    <div className="settings-page">
      <h1>Настройки</h1>
      <div className="settings-section">
        <h3>Управление датчиками (Симуляция)</h3>
        <p>Добавьте новые или удалите существующие датчики с главной панели.</p>
        <button 
          className="btn-primary btn-with-icon"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          <span>Добавить новый датчик</span>
        </button>
      </div>
      <div className="settings-section">
        <h3>Управление Порогами Оповещений</h3> 
        <p>
          Установите минимальные и максимальные пороги для симулятора.
          Модуль мониторинга пришлет оповещение при выходе за эти пределы.
        </p>
        <div className="alert-settings-list">
          {sensors.length === 0 && <p>Датчики не найдены.</p>}
          {sensors.map(sensor => (
            <div key={sensor.id} className="alert-settings-item">
              <h4>{sensor.name} ({sensor.unit})</h4>
              <div className="form-row">
                <button 
                  className={`alert-toggle-btn ${sensor.alertEnabled ? 'active' : ''}`}
                  onClick={() => handleSettingChange(sensor.id, 'alertEnabled', !sensor.alertEnabled)}
                  title={sensor.alertEnabled ? 'Оповещения Включены' : 'Оповещения Выключены'}
                >
                  {sensor.alertEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                </button>
                <div className="form-group-inline">
                  <label htmlFor={`min-${sensor.id}`}>Мин:</label>
                  <input 
                    type="number"
                    id={`min-${sensor.id}`}
                    value={sensor.min}
                    onChange={(e) => handleSettingChange(sensor.id, 'min', e.target.value)}
                  />
                </div>
                <div className="form-group-inline">
                  <label htmlFor={`max-${sensor.id}`}>Макс:</label>
                  <input 
                    type="number"
                    id={`max-${sensor.id}`}
                    value={sensor.max}
                    onChange={(e) => handleSettingChange(sensor.id, 'max', e.target.value)}
                  />
                </div>
                <button 
                  className="btn-primary btn-with-icon"
                  onClick={() => handleSaveSettings(sensor.id)}
                  title="Сохранить настройки"
                >
                  <Save size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <AddSensorModal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddSensor}
        />
      )}
    </div>
  );
}
export default SettingsPage;