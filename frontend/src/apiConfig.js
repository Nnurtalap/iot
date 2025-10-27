// VITE_API_URL - это переменная, которую мы зададим в Netlify
// Если ее нет (при локальной разработке), используется localhost

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log("API URL:", API_URL); // Для отладки