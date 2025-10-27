import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// dataKey - это ключ ('value' или 'temperature')
// unit - это единица ('°C' или '%')
const TemperatureChart = ({ data, dataKey = "value", unit = "" }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 20, // Немного отступ
          left: 0,
          bottom: 5,
        }}
      >
        {/* Более легкая, "яблочная" сетка */}
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#e5e5e7" 
        />
        <XAxis 
          dataKey="time" 
          stroke="#555" 
          fontSize={12} 
        />
        <YAxis 
          stroke="#555" 
          fontSize={12}
          unit={unit} 
          domain={['dataMin - 2', 'dataMax + 2']} 
        />
        <Tooltip
          // Стиль "всплывашки"
          contentStyle={{ 
            backgroundColor: '#ffffff',
            border: '1px solid #d2d2d7',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
          }}
          labelStyle={{ color: '#1d1d1f', fontWeight: '600' }}
          formatter={(value) => [`${value} ${unit}`, "Значение"]}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey={dataKey}
          name="Значение"
          stroke="#007aff" /* Apple Blue */
          strokeWidth={2} /* Чуть жирнее */
          activeDot={{ r: 6 }} 
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TemperatureChart;