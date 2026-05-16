// src/views/UnifiedView.jsx
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, ChevronRight, Layers, Database, Users, X } from 'lucide-react';
import './UnifiedView.css';

export function UnifiedView({ 
  excavations = [], 
  users = [], 
  onAddExcavation, 
  sectors = [], 
  ues = [] 
}) {
  const [selectedExcId, setSelectedExcId] = useState(null);
  const [selectedSecId, setSelectedSecId] = useState(null);
  const [isAddingExc, setIsAddingExc] = useState(false);
  const [newExcName, setNewExcName] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // --- CONSOLE LOG PARA DEPURACIÓN ---
  useEffect(() => {
    console.log("--- DEBUG KRONOS USERS ---");
    console.log("Lista completa de usuarios recibida:", users);
    console.log("Cantidad de usuarios:", users?.length);
  }, [users]);

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateExcavation = async () => {
    if (!newExcName) return;
    await onAddExcavation({
      name: newExcName,
      users: selectedUsers
    });
    setNewExcName('');
    setSelectedUsers([]);
    setIsAddingExc(false);
  };

  return (
    <div className="triple-column-layout">
      {/* COLUMNA 1: YACIMIENTOS */}
      <div className="column">
        <div className="column-header">
          <div className="flex-row">
            <Database size={14} className="text-amber" />
            <h3>YACIMIENTOS</h3>
          </div>
          <button onClick={() => setIsAddingExc(!isAddingExc)} className="btn-icon">
            {isAddingExc ? <X size={16}/> : <Plus size={16}/>}
          </button>
        </div>
        
        <div className="column-content">
          {isAddingExc && (
            <div className="quick-add-form">
              <input 
                value={newExcName} 
                onChange={e => setNewExcName(e.target.value)} 
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
                  {/* Si el array llega vacío de Django, mostramos una alerta visual limpia */}
                  {(!users || users.length === 0) && (
                    <span style={{ color: '#d9534f', fontSize: '11px', fontWeight: 'bold' }}>
                      ⚠️ No hay usuarios disponibles en Kronos
                    </span>
                  )}

                  {(users || [])
                    .filter(u => {
                      // Corrección: Buscamos usando las propiedades name, surname y email devueltas por Django
                      const fullName = `${u.name || ''} ${u.surname || ''} ${u.email || ''}`;
                      return fullName.toLowerCase().includes(userSearch.toLowerCase());
                    })
                    .map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleUser(user.id)}
                        className={`chip ${selectedUsers.includes(user.id) ? 'active' : ''}`}
                      >
                        {/* Corrección: Renderizamos el nombre y apellido real del serializer */}
                        {user.name ? `${user.name} ${user.surname || ''}` : user.email}
                      </button>
                    ))
                  }
                </div>
              </div>

              <button className="btn-save" onClick={handleCreateExcavation}>
                CONFIRMAR REGISTRO
              </button>
            </div>
          )}

          <div className="list-wrapper">
            {excavations.map(exc => (
              <div 
                key={exc.id} 
                onClick={() => { setSelectedExcId(exc.id); setSelectedSecId(null); }}
                className={`nav-card ${selectedExcId === exc.id ? 'active' : ''}`}
              >
                <h4>{exc.name}</h4>
                <div className="card-right">
                   <span className="count-pill">{sectors.filter(s => s.excavation === exc.id).length} S</span>
                   <ChevronRight size={14} className="arrow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COLUMNA 2: SECTORES */}
      <div className={`column ${!selectedExcId ? 'disabled' : ''}`}>
        <div className="column-header">
          <div className="flex-row"><Layers size={14} /><h3>SECTORES</h3></div>
        </div>
        <div className="column-content">
          {!selectedExcId ? <div className="empty-state">Selecciona yacimiento</div> : (
            <div className="list-wrapper">
              {sectors.filter(s => s.excavation === selectedExcId).map(sec => (
                <div key={sec.id} onClick={() => setSelectedSecId(sec.id)} className={`nav-card ${selectedSecId === sec.id ? 'active' : ''}`}>
                  <h4>{sec.name}</h4>
                  <div className="badge">{ues.filter(u => u.sector === sec.id).length} UEs</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* COLUMNA 3: REGISTROS UE */}
      <div className={`column flex-grow ${!selectedSecId ? 'disabled' : ''}`}>
        <div className="column-header"><h3>REGISTROS UE</h3></div>
        <div className="column-content">
          {selectedSecId ? (
            <table className="kronos-table">
              <thead><tr><th>ID</th><th>TIPO</th><th className="text-right">ACCIONES</th></tr></thead>
              <tbody>
                {ues.filter(u => u.sector === selectedSecId).map(ue => (
                  <tr key={ue.id}>
                    <td className="ue-id">UE-{ue.number}</td>
                    <td><span className="type-tag">{ue.type}</span></td>
                    <td className="text-right">
                      <button className="btn-del"><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="empty-state">Selecciona un sector</div>}
        </div>
      </div>
    </div>
  );
}