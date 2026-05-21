import React, { useState } from 'react';

export function SectorForm({ initialName = '', onSave, onCancel }) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name);
  };

  return (
    <div className="quick-add-form" style={{ marginBottom: '10px', padding: '10px', borderLeft: initialName ? '3px solid #f59e0b' : 'none' }}>
      <div className="label-mini" style={{ color: '#f59e0b', marginBottom: '6px', fontWeight: 'bold' }}>
        {initialName ? 'MODIFICANDO SECTOR' : 'NUEVO SECTOR'}
      </div>
      <input 
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nombre del sector..."
        className="main-input"
        style={{ fontSize: '12px', padding: '6px' }}
      />
      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
        <button className="btn-save" onClick={handleSubmit} style={{ fontSize: '11px', padding: '6px', flex: 1 }}>
          {initialName ? 'ACTUALIZAR' : 'GUARDAR SECTOR'}
        </button>
        <button type="button" onClick={onCancel} style={{ fontSize: '11px', padding: '6px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ✕
        </button>
      </div>
    </div>
  );
}