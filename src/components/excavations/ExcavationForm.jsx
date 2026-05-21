import React, { useState } from 'react';
import { Users } from 'lucide-react';

export function ExcavationForm({ users = [], initialData = null, onSave, onCancel }) {
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(
    initialData?.users?.map(u => typeof u === 'object' ? u.id : u) || []
  );

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, users: selectedUsers });
  };

  return (
    <div className="quick-add-form" style={{ borderLeft: initialData ? '3px solid #f59e0b' : 'none' }}>
      <div className="label-mini" style={{ color: '#f59e0b', marginBottom: '6px', fontWeight: 'bold' }}>
        {initialData ? 'MODIFICANDO YACIMIENTO' : 'NUEVO YACIMIENTO'}
      </div>
      
      <input 
        value={name} 
        onChange={e => setName(e.target.value)} 
        placeholder="Nombre del yacimiento..." 
        className="main-input"
      />
      
      <div className="user-selector">
        <div className="label-mini"><Users size={12} /> <span>ASIGNAR EQUIPO</span></div>
        <input 
          className="search-mini"
          placeholder="Buscar por nombre..."
          value={userSearch}
          onChange={e => setUserSearch(e.target.value)}
        />
        <div className="chips-container">
          {users.length === 0 && (
            <span style={{ color: '#d9534f', fontSize: '11px', fontWeight: 'bold' }}>
              No hay usuarios disponibles en Kronos
            </span>
          )}

          {users
            .filter(u => {
              const fullName = `${u.name || ''} ${u.surname || ''} ${u.email || ''}`;
              return fullName.toLowerCase().includes(userSearch.toLowerCase());
            })
            .map(userItem => (
              <button
                key={userItem.id}
                type="button"
                onClick={() => toggleUser(userItem.id)}
                className={`chip ${selectedUsers.includes(userItem.id) ? 'active' : ''}`}
              >
                {userItem.name ? `${userItem.name} ${userItem.surname || ''}` : userItem.email}
              </button>
            ))
          }
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <button className="btn-save" onClick={handleSubmit} style={{ flex: 1 }}>
          {initialData ? 'GUARDAR CAMBIOS' : 'CONFIRMAR REGISTRO'}
        </button>
        <button type="button" className="btn-cancel" onClick={onCancel} style={{ background: '#333', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}