import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast'; // 1. Контейнер для "всплывашек"
import AlertListener from '../AlertListener'; // 2. Наш "слушатель" аномалий

// Layout получает 'socket' из App.jsx
function Layout({ socket }) {
  return (
    <div className="layout-container">
      
      {/* 3. Этот компонент будет показывать всплывающие уведомления */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          // Стили по умолчанию для "всплывашек"
           style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      
      {/* 4. Наше боковое меню */}
      <Sidebar />
      
      {/* 5. Область для контента страницы */}
      <main className="content-area">
        
        {/* 6. <Outlet> — это "дырка", куда React Router 
             вставляет нужную страницу (Главную, Настройки и т.д.)
             Мы передаем 'socket' "внутрь" всех дочерних страниц 
             через 'context'.
        */}
        <Outlet context={{ socket }} />
      </main>
      
      {/* 7. <AlertListener> "сидит" здесь постоянно.
           Мы передаем ему 'socket' напрямую как prop.
           ИМЕННО ЭТА СТРОКА ИСПРАВЛЯЕТ ОШИБКУ.
      */}
      <AlertListener socket={socket} />
      
    </div>
  );
}

export default Layout;