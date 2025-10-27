const express = require('express');
const cors = require('cors');
const http = require('http'); 
const { Server } = require("socket.io"); 

const app = express();
const PORT = 3001;

const server = http.createServer(app); 
const io = new Server(server, { 
  cors: {
    origin: [
      "http://localhost:5173", 
      "https://iotqq.netlify.app"  // <--- ВОТ ИСПРАВЛЕНИЕ
    ],
    methods: ["GET", "POST", "DELETE", "PUT"]
  }
});

app.use(cors()); 
app.use(express.json()); 

const sensorsDB = {
  'temp-living-room': { 
    name: 'Температура (Гостиная)', 
    unit: '°C', 
    value: 21,
    min: 18, 
    max: 26, 
    alertEnabled: true 
  },
  'humidity-living-room': { 
    name: 'Влажность (Гостиная)', 
    unit: '%', 
    value: 45,
    min: 30,
    max: 60,
    alertEnabled: true
  },
  'temp-outside': { 
    name: 'Температура (Улица)', 
    unit: '°C', 
    value: 7,
    min: -5,
    max: 30,
    alertEnabled: false 
  },
};

// Функция-СИМУЛЯТОР
function updateSensorData(sensorId) {
  const sensor = sensorsDB[sensorId];
  if (!sensor) return;
  
  let change;
  if (sensorId.includes('temp')) change = (Math.random() - 0.5) * 2;
  else change = (Math.random() - 0.5) * 5; 
  
  sensor.value = parseFloat((sensor.value + change).toFixed(2));
  
  if (sensor.value < -50) sensor.value = -50; 
  if (sensor.value > 150) sensor.value = 150;
  
  return {
    id: sensorId,
    name: sensor.name,
    value: sensor.value,
    unit: sensor.unit,
    timestamp: new Date().toISOString()
  };
}

// --- API ЭНДПОИНТЫ ---

app.get('/api/sensors', (req, res) => {
  res.json(Object.keys(sensorsDB).map(id => ({
    id: id,
    ...sensorsDB[id]
  })));
});

app.get('/api/sensors/:id/history', (req, res) => {
  const { id } = req.params;
  const { range } = req.query;
  const sensor = sensorsDB[id];
  if (!sensor) return res.status(404).json({ error: 'Датчик не найден' });
  let points = 60; 
  if (range === '24h') points = 24;
  if (range === '7d') points = 7; 
  const history = [];
  for (let i = 0; i < points; i++) {
    const fakeData = updateSensorData(id);
    let timeLabel = fakeData.timestamp.split('T')[1].split('.')[0].slice(3);
    if (range === '24h') timeLabel = `Час ${i+1}`;
    if (range === '7d') timeLabel = `День ${i+1}`;
    history.push({ time: timeLabel, value: fakeData.value });
  }
  res.json({ id: id, name: sensor.name, unit: sensor.unit, history: history });
});

app.post('/api/sensors', (req, res) => {
  const { id, name, unit } = req.body;
  if (!id || !name || !unit) return res.status(400).json({ error: 'Не все поля заполнены' });
  if (sensorsDB[id]) return res.status(400).json({ error: 'Датчик с таким ID уже существует' });

  const newSensor = {
    name: name,
    unit: unit,
    value: 0,
    min: 0, 
    max: 100,
    alertEnabled: false
  };
  sensorsDB[id] = newSensor;
  
  const sensorWithId = { id: id, ...newSensor };
  
  io.emit('sensor_created', sensorWithId);
  io.emit('log_event', {
    type: 'create',
    message: `✅ Датчик "${name}" (${id}) был добавлен в систему.`,
    timestamp: new Date().toISOString()
  });
  
  res.status(201).json({ message: 'Датчик создан' });
});

app.delete('/api/sensors/:id', (req, res) => {
  const { id } = req.params;
  if (sensorsDB[id]) {
    const sensorName = sensorsDB[id].name;
    delete sensorsDB[id];
    
    io.emit('sensor_deleted', id); 
    io.emit('log_event', {
      type: 'delete',
      message: `🗑️ Датчик "${sensorName}" (${id}) был удален из системы.`,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json({ message: 'Датчик удален' });
  } else {
    res.status(404).json({ error: 'Датчик не найден' });
  }
});

app.put('/api/sensors/:id/settings', (req, res) => {
  const { id } = req.params;
  const { min, max, alertEnabled } = req.body;
  const sensor = sensorsDB[id];
  if (!sensor) return res.status(404).json({ error: 'Датчик не найден' });

  sensor.min = parseFloat(min);
  sensor.max = parseFloat(max);
  sensor.alertEnabled = Boolean(alertEnabled);
  
  const updatedSettings = {
    id: id,
    min: sensor.min,
    max: sensor.max,
    alertEnabled: sensor.alertEnabled
  };
  
  io.emit('sensor_settings_updated', updatedSettings);
  io.emit('log_event', {
    type: 'settings',
    message: `⚙️ Пороги для "${sensor.name}" обновлены. (Alerts: ${alertEnabled})`,
    timestamp: new Date().toISOString()
  });
  
  res.status(200).json({ message: 'Настройки обновлены' });
});


// --- ЛОГИКА WEBSOCKET ---
io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);
  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});

// --- ГЛАВНЫЙ ЦИКЛ СИМУЛЯТОРА ---
setInterval(() => {
  const updates = [];
  
  for (const id in sensorsDB) {
    const sensor = sensorsDB[id];
    const update = updateSensorData(id);
    updates.push(update);
    
    // ПРАВДИВЫЙ ЛОГ:
    io.emit('log_event', {
      type: 'data',
      message: `[СИМУЛЯТОР]: "${sensor.name}" сгенерировал: ${update.value.toFixed(2)} ${sensor.unit}`,
      timestamp: new Date().toISOString()
    });

    // --- МОДУЛЬ МОНИТОРИНГА (вместо "AI") ---
    if (sensor.alertEnabled) {
      let anomalyFound = false;
      let alertMessage = '';

      if (update.value > sensor.max) {
        anomalyFound = true;
        alertMessage = `🚨 СРАБОТАЛ ПОРОГ: Превышен ВЕРХНИЙ! Датчик "${sensor.name}" 
          показал ${update.value} ${sensor.unit} (Макс: ${sensor.max} ${sensor.unit}).`;
      } else if (update.value < sensor.min) {
        anomalyFound = true;
        alertMessage = `🚨 СРАБОТАЛ ПОРОГ: Пробит НИЖНИЙ! Датчик "${sensor.name}" 
          показал ${update.value} ${sensor.unit} (Мин: ${sensor.min} ${sensor.unit}).`;
      }
      
      if (anomalyFound) {
        io.emit('anomaly_alert', {
          title: 'Обнаружено Отклонение!', // Более "правдивый" заголовок
          message: alertMessage
        });
        io.emit('log_event', {
          type: 'alert',
          message: alertMessage,
          timestamp: new Date().toISOString()
        });
        
        sensor.alertEnabled = false; 
        io.emit('sensor_settings_updated', {
          id: id,
          min: sensor.min,
          max: sensor.max,
          alertEnabled: sensor.alertEnabled
        });
        // Лог об авто-отключении
        io.emit('log_event', {
          type: 'settings',
          message: `⚙️ Оповещения для "${sensor.name}" автоматически отключены (защита от спама).`,
          timestamp: new Date().toISOString()
        });
      }
    }
  }
  
  io.emit('sensor_updates', updates);
  
}, 2000); 

// --- ЗАПУСК СЕРВЕРА ---
server.listen(PORT, () => {
  console.log(`Backend API и WebSocket запущены на http://localhost:${PORT}`);
});