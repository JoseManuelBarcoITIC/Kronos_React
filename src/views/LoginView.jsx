// src/components/LoginView.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';
import './LoginView.css';

export function LoginView({ onLoginSuccess }) {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false); // Reseteamos el error en cada intento de envío
    
    try {
      // 1. El servicio valida las credenciales y guarda 'kronos_token' y 'kronos_user' en localStorage
      const data = await authService.login(creds.email, creds.password);
      
      // 🔄 IMPRESCINDIBLE: Pasamos TODO el objeto de datos a App.jsx
      // Esto contiene { access, refresh, user }
      onLoginSuccess(data); 
      
    } catch (err) {
      console.error("Fallo al iniciar sesión en el panel de Kronos:", err);
      setError(true);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-header">
          <h2 className="login-title">KRONOS</h2>
          <div className="login-subtitle">Excavation Management System</div>
        </div>

        {/* Mensaje de error condicional */}
        {error && <div className="error-msg">ERROR DE AUTENTICACIÓN</div>}

        <input 
          className="login-input"
          type="email" 
          placeholder="EMAIL" 
          value={creds.email} 
          onChange={e => setCreds({ ...creds, email: e.target.value })} 
          required 
        />
        
        <input 
          className="login-input"
          type="password" 
          placeholder="PASSWORD" 
          value={creds.password} 
          onChange={e => setCreds({ ...creds, password: e.target.value })} 
          required 
        />
        
        <button type="submit" className="login-button">
          Establecer Conexión
        </button>
      </form>
    </div>
  );
}