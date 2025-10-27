import React from 'react';
import { CloudOff, GraduationCap, Sparkle, Target } from 'lucide-react';

function AboutPage() {
  return (
    <div className="static-page">
      <h1>Описание Кейса (Proof-of-Concept)</h1>
      
      <section>
        <h2>Цель Демонстрации</h2>
        <p>
          Этот проект (Proof-of-Concept) демонстрирует возможности фронтенд-приложения 
          для сбора, обработки и анализа потоковых данных с IoT-устройств в реальном времени.
          Это **демонстрационный стенд**, а не production-система.
        </p>
        
        <div className="info-grid" style={{marginTop: '2rem'}}>
          <div className="info-card">
            <div className="info-card-icon" style={{backgroundColor: '#007AFF'}}>
              <CloudOff size={24} />
            </div>
            <h4>Потенциал импортозамещения</h4>
            <p>
              Демонстрация возможности создания отечественного решения 
              для снижения зависимости от зарубежных облачных сервисов.
            </p>
          </div>
          
          <div className="info-card">
            <div className="info-card-icon" style={{backgroundColor: '#34C759'}}>
              <Sparkle size={24} />
            </div>
            <h4>Эффективность анализа</h4>
            <p>
              Визуализация эффективности real-time анализа потоковых данных
              и модуля мониторинга (детекции отклонений).
            </p>
          </div>
          
          <div className="info-card">
            <div className="info-card-icon" style={{backgroundColor: '#FF9500'}}>
              <Target size={24} />
            </div>
            <h4>Гибкая Архитектура</h4>
            <p>
              Прототип спроектирован так, чтобы его бэкенд мог быть
              развернут на базе технологий Green Data Center.
            </p>
          </div>

          <div className="info-card">
            <div className="info-card-icon" style={{backgroundColor: '#AF52DE'}}>
              <GraduationCap size={24} />
            </div>
            <h4>Образовательный Кейс</h4>
            <p>
              Платформа используется как "Edu-Case" для студентов, 
              позволяя им работать с симуляцией реальных потоковых данных.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Проблема и Актуальность</h2>
        <p>
          В индустрии и образовании существует потребность в недорогих
          и эффективных инструментах для анализа IoT-данных. Этот стенд 
          показывает, как может выглядеть интерфейс для решения 
          этой задачи.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;