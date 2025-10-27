import React from 'react';
import { 
  Database, 
  Server, 
  Shuffle, 
  Layout, 
  Container, 
  Waypoints,
  Package 
} from 'lucide-react';

function ArchitecturePage() {
  return (
    <div className="static-page">
      <h1>Целевая Архитектура (Production)</h1>
      <p>
        Этот дашборд (Frontend) — это **симуляция**. Он имитирует
        работу с высоконагруженной Big Data платформой.
      </p>
      <p>
        В **реальной (production)** среде, бэкенд для этого дашборда 
        (который сейчас представлен одним Node.js файлом) 
        <b>подразумевал бы</b> использование следующего стека:
      </p>

      <div className="arch-list" style={{marginTop: '2rem'}}>

        <div className="arch-item">
          <div className="arch-item-icon">
            <Waypoints size={24} />
          </div>
          <div className="arch-item-content">
            <h4>1. Сбор данных (Ingestion)</h4>
            <p>
              <b>Apache Kafka</b> как отказоустойчивый брокер 
              сообщений для приема миллионов событий от IoT-устройств.
            </p>
          </div>
        </div>
        
        <div className="arch-item">
          <div className="arch-item-icon">
            <Shuffle size={24} />
          </div>
          <div className="arch-item-content">
            <h4>2. Обработка потоков (Processing)</h4>
            <p>
              <b>Apache Spark (Spark Streaming) / Flink</b> для обработки 
              данных "на лету": агрегации, обогащения и запуска 
              ML-моделей (детекции аномалий).
            </p>
          </div>
        </div>

        <div className="arch-item">
          <div className="arch-item-icon">
            <Database size={24} />
          </div>
          <div className="arch-item-content">
            <h4>3. Хранение (Storage)</h4>
            <p>
              <b>Cassandra / InfluxDB:</b> Для "горячих" данных (time-series).
              <br/>
              <b>MinIO / HDFS:</b> S3-совместимое "холодное" хранилище 
              (Data Lake) для "сырых" данных и артефактов MLflow.
            </p>
          </div>
        </div>

        <div className="arch-item">
          <div className="arch-item-icon">
            <Server size={24} />
          </div>
          <div className="arch-item-content">
            <h4>4. API (Backend)</h4>
            <p>
              <b>(То, что мы симулируем)</b> Сервис на <b>Node.js (Express)</b> или <b>Go</b>, 
              который предоставляет агрегированные данные из Cassandra/InfluxDB 
              дашборду через REST и <b>WebSockets</b>.
            </p>
          </div>
        </div>

        <div className="arch-item">
          <div className="arch-item-icon">
            <Layout size={24} />
          </div>
          <div className="arch-item-content">
            <h4>5. Визуализация (Frontend)</h4>
            <p>
              <b>(То, что вы видите)</b> <b>React-приложение</b> (Vite, 
              Recharts, Lucide-icons) для "живой" визуализации.
            </p>
          </div>
        </div>

        <div className="arch-item">
          <div className="arch-item-icon">
            <Package size={24} />
          </div>
          <div className="arch-item-content">
            <h4>6. Оркестрация (Production)</h4>
            <p>
              Вся система упакована в <b>Docker</b>-контейнеры 
              и управляется с помощью <b>Kubernetes</b> для масштабируемости.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ArchitecturePage;