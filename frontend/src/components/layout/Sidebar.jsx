import React from 'react';
import { NavLink } from 'react-router-dom';
// 1. Импортируем иконки из lucide-react
import { 
  LayoutDashboard, 
  Info, 
  Network, 
  Settings 
} from 'lucide-react';

function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h3>Прототип IoT</h3>
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            {/* 2. Используем иконки */}
            <LayoutDashboard size={18} />
            <span>Главная</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <Info size={18} />
            <span>О Проекте</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/architecture" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <Network size={18} />
            <span>Архитектура</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <Settings size={18} />
            <span>Настройки</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;