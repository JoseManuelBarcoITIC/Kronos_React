import React from 'react';
import { Edit2 } from 'lucide-react';

export function SectorCard({ sec, ues, isActive, isAdmin, onSelect, onStartEdit }) {
  const ueCount = ues.filter(u => u.sector === sec.id).length;

  return (
    <div 
      onClick={onSelect}
      className={`nav-card ${isActive ? 'active' : ''}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
        <h4>{sec.name}</h4>
        {isAdmin && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartEdit(sec);
            }}
            className="btn-edit-inline"
            style={{
              background: 'none', border: 'none', color: '#f59e0b',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', padding: 0
            }}
          >
            <Edit2 size={10} /> EDITAR SECTOR
          </button>
        )}
      </div>
      <div className="badge">{ueCount} UEs</div>
    </div>
  );
}