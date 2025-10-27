import React from 'react';
import GaugeChart from 'react-gauge-chart';

// Этот компонент будет принимать значение (value) и единицу (unit)
// и рисовать красивый "спидометр"
const SensorGauge = ({ value, unit }) => {
  const normalizedValue = value || 0;
  
  // Определяем "уровни" для разных датчиков
  let arcs;
  let max;

  if (unit === '%') {
    // Для Влажности (0-100%)
    max = 100;
    arcs = [0.4, 0.3, 0.3]; // 40% (сухо), 30% (норма), 30% (влажно)
  } else {
    // Для Температуры (предположим, от -10 до 40)
    max = 40; 
    // Нормализуем значение от 0 до 1
    // (value + 10) / (40 - (-10))
    value = (normalizedValue + 10) / 50;
    arcs = [0.2, 0.4, 0.4]; // (-10 до 0), (0 до 20), (20 до 40)
  }

  return (
    <div style={{ width: '100%', marginTop: '-15px' }}>
      <GaugeChart
        id={`gauge-${Math.random()}`} // Уникальный ID
        nrOfLevels={3}
        arcsLength={arcs}
        colors={['#007AFF', '#58B431', '#FF3B30']} // Синий, Зеленый, Красный
        percent={value / max} // Значение от 0 до 1
        arcPadding={0.02}
        cornerRadius={3}
        needleColor="#555"
        needleBaseColor="#555"
        hideText={true} // Мы напишем свой текст поверх
      />
      {/* Текст, который мы накладываем поверх "спидометра" */}
      <div className="gauge-value-text">
        {normalizedValue}
        <span className="gauge-unit">{unit}</span>
      </div>
    </div>
  );
};

export default SensorGauge;