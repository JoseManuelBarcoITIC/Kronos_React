import React from 'react';
import { ChevronRight, Edit2 } from 'lucide-react';

export function ExcavationCard({ exc, sectors, isActive, isAdmin, onSelect, onStartEdit }) {
  const sectorCount = sectors.filter(s => s.excavation === exc.id).length;

  return (
    <div 
      onClick={onSelect}
      className={`nav-card ${isActive ? 'active' : ''}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
        <h4>{exc.name}</h4>
        {isAdmin && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartEdit(exc);
            }}
            className="btn-edit-inline"
            style={{
              background: 'none', border: 'none', color: '#f59e0b',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', padding: 0
            }}
          >
            <Edit2 size={10} /> EDITAR REGISTRO
          </button>
        )}
      </div>

      <div className="card-right">
         <span className="count-pill">{sectorCount} S</span>
         <ChevronRight size={14} className="arrow" />
      </div>
    </div>
  );
}