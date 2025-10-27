import React, { useState } from 'react';

function AddSensorModal({ onClose, onSubmit }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('°C');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || !name || !unit) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    onSubmit({ id, name, unit });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Добавить новый датчик</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sensor-id">ID Датчика (англ.)</label>
            <input
              type="text"
              id="sensor-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Например, temp-bedroom"
            />
          </div>
          <div className="form-group">
            <label htmlFor="sensor-name">Имя (для отображения)</label>
            <input
              type="text"
              id="sensor-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Температура (Спальня)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="sensor-unit">Единица изм.</label>
            <input
              type="text"
              id="sensor-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Например, °C или %"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-primary">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSensorModal;