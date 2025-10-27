import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Принимаем 'socket' как prop
function AlertListener({ socket }) {

  useEffect(() => {
    if (!socket) return;

    // Слушаем 'anomaly_alert'
    const handleAlert = (alertData) => {
      console.log('Получено оповещение:', alertData);
      
      // Показываем "всплывашку"
      toast.error(
        (t) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <b style={{fontSize: '1.1rem'}}>{alertData.title}</b>
            <span>{alertData.message}</span>
            <button 
              onClick={() => toast.dismiss(t.id)}
              style={{
                marginTop: '10px', 
                background: '#007aff', /* Apple Blue */
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                padding: '8px 12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Понятно
            </button>
          </div>
        ),
        {
          duration: 10000, // 10 секунд
          style: {
            background: '#ffffff',
            color: '#1d1d1f',
            border: '1px solid #d2d2d7',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
          }
        }
      );
    };

    socket.on('anomaly_alert', handleAlert);

    return () => {
      socket.off('anomaly_alert', handleAlert);
    };
  }, [socket]);

  return null; // Невидимый компонент
}

export default AlertListener;