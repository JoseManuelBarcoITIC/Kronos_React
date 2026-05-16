import React from 'react';
import { Database, Users, LogOut } from 'lucide-react';
import './Sidebar.css';

export function Sidebar({ isOpen, setIsOpen, view, setView, user, onLogout, isAdmin }) {

  console.log("--- DEBUG SIDEBAR KRONOS ---");
  console.log("¿Qué llega en la prop 'user'?:", user);
  console.log("¿Qué llega en la prop 'isAdmin'?:", isAdmin);
  
  const colors = {
    pergamino: '#F5F2ED',
    tierra: '#4B3621',
    siena: '#A0522D',
    oliva: '#556B2F',
    oro: '#D4AF37'
  };

  return (
    <aside 
      className="kronos-sidebar"
      style={{ width: isOpen ? '260px' : '80px' }}
    >
      <div onClick={() => setIsOpen(!isOpen)} className="sidebar-header">
        <div className="sidebar-logo-box">
          K
        </div>
        {isOpen && (
          <span className="sidebar-title">
            Kronos
          </span>
        )}
      </div>

      <nav className="sidebar-nav">
        <NavItem 
          icon={<Database size={20}/>} 
          label="Excavaciones" 
          active={view === 'core'} 
          onClick={() => setView('core')} 
          isOpen={isOpen}
          colors={colors}
        />
        
        {isAdmin && (
          <NavItem 
            icon={<Users size={20}/>} 
            label="Usuarios" 
            active={view === 'users'} 
            onClick={() => setView('users')} 
            isOpen={isOpen}
            tag="ADMIN"
            colors={colors}
          />
        )}
      </nav>

      <div className="sidebar-footer">
        {isOpen && (
          <div className="operator-section">
            <p className="operator-label">OPERADOR</p>
            <p className="operator-name">
              {user?.name || user?.email || 'Explorador_Activo'}
            </p>
          </div>
        )}
        <button onClick={onLogout} className="btn-logout">
          <LogOut size={16} />
          {isOpen && <span>DESCONECTAR</span>}
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick, isOpen, tag, colors }) {
  return (
    <button 
      onClick={onClick} 
      className={`nav-item-btn ${active ? 'active' : ''}`}
    >
      <div className="nav-item-icon">{icon}</div>
      {isOpen && <span className="nav-item-label">{label}</span>}
      {isOpen && tag && (
        <span className="nav-item-tag">{tag}</span>
      )}
    </button>
  );
}