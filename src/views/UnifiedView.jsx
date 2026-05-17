import React, { useState, useEffect } from 'react';
import { Trash2, Plus, ChevronRight, Layers, Database, Users, X, Edit2 } from 'lucide-react';
import './UnifiedView.css';

export function UnifiedView({ 
  excavations = [], 
  users = [], 
  sectors = [], 
  ues = [],
  user = null, 
  onAddExcavation, 
  onUpdateExcavation,
  onAddSector,
  onUpdateSector 
}) {
  
  const [selectedExcId, setSelectedExcId] = useState(null);
  const [selectedSecId, setSelectedSecId] = useState(null);
  
  // Estados para Yacimientos
  const [isAddingExc, setIsAddingExc] = useState(false);
  const [editingExcId, setEditingExcId] = useState(null);
  const [newExcName, setNewExcName] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Estados para Sectores
  const [isAddingSector, setIsAddingSector] = useState(false);
  const [editingSectorId, setEditingSectorId] = useState(null); // ➕ Controla qué sector se edita
  const [newSectorName, setNewSectorName] = useState('');

  const isAdmin = user && (user.is_staff === true || user.is_superuser === true);

  const visibleExcavations = excavations.filter(exc => {
    if (isAdmin) return true; 
    return exc.users?.some(u => {
      const assignedId = typeof u === 'object' ? u.id : u;
      return assignedId === user?.id;
    });
  });

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleStartEdit = (e, exc) => {
    e.preventDefault();
    e.stopPropagation(); 
    setIsAddingExc(false);
    setEditingExcId(exc.id);
    setNewExcName(exc.name);
    const currentUsers = exc.users?.map(u => typeof u === 'object' ? u.id : u) || [];
    setSelectedUsers(currentUsers);
  };

  // ➕ Abre el panel de edición de sector mapeando sus valores actuales
  const handleStartEditSector = (e, sec) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingSector(false);
    setEditingSectorId(sec.id);
    setNewSectorName(sec.name);
  };

  const handleCancel = () => {
    setIsAddingExc(false);
    setEditingExcId(null);
    setNewExcName('');
    setSelectedUsers([]);
    setUserSearch('');
  };

  // ➕ Limpia el estado de los formularios de sector
  const handleCancelSector = () => {
    setIsAddingSector(false);
    setEditingSectorId(null);
    setNewSectorName('');
  };

  const handleSaveExcavation = async () => {
    if (!newExcName) return;
    if (editingExcId) {
      if (onUpdateExcavation) await onUpdateExcavation(editingExcId, { name: newExcName, users: selectedUsers });
    } else {
      if (onAddExcavation) await onAddExcavation({ name: newExcName, users: selectedUsers });
    }
    handleCancel();
  };

  // 🔄 Combinado para manejar tanto Creación como Actualización de Sectores
  const handleSaveSector = async () => {
    if (!newSectorName || !selectedExcId) return;

    if (editingSectorId) {
      if (onUpdateSector) {
        await onUpdateSector(editingSectorId, {
          name: newSectorName,
          excavation: selectedExcId // Mantiene el vínculo estructural con su yacimiento
        });
      }
    } else {
      if (onAddSector) {
        await onAddSector({
          name: newSectorName,
          excavation: selectedExcId
        });
      }
    }
    handleCancelSector();
  };

  return (
    <div className="triple-column-layout">
      
      {/* COLUMNA 1: YACIMIENTOS */}
      <div className="column">
        <div className="column-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="flex-row">
            <Database size={14} className="text-amber" />
            <h3>YACIMIENTOS {!isAdmin && "ASIGNADOS"}</h3>
          </div>
          
          {isAdmin && (
            <button 
              onClick={() => (isAddingExc || editingExcId ? handleCancel() : setIsAddingExc(true))} 
              className="btn-icon"
              type="button"
              style={{ background: '#f59e0b', color: '#000', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'inline-block' }}
            >
              {isAddingExc || editingExcId ? <X size={16}/> : <Plus size={16}/>}
            </button>
          )}
        </div>
        
        <div className="column-content">
          {(isAddingExc || editingExcId !== null) && (
            <div className="quick-add-form" style={{ borderLeft: editingExcId ? '3px solid #f59e0b' : 'none' }}>
              <div className="label-mini" style={{ color: '#f59e0b', marginBottom: '6px', fontWeight: 'bold' }}>
                {editingExcId ? '⚠️ MODIFICANDO YACIMIENTO' : 'NUEVO YACIMIENTO'}
              </div>
              
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
                  {(!users || users.length === 0) && (
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

              <button className="btn-save" onClick={handleSaveExcavation}>
                {editingExcId ? 'GUARDAR CAMBIOS' : 'CONFIRMAR REGISTRO'}
              </button>
            </div>
          )}

          <div className="list-wrapper">
            {visibleExcavations.length === 0 ? (
              <div className="empty-state">No tienes yacimientos asignados</div>
            ) : (
              visibleExcavations.map(exc => (
                <div 
                  key={exc.id} 
                  onClick={() => { setSelectedExcId(exc.id); setSelectedSecId(null); handleCancelSector(); }}
                  className={`nav-card ${selectedExcId === exc.id ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                    <h4>{exc.name}</h4>
                    {isAdmin && (
                      <button 
                        onClick={(e) => handleStartEdit(e, exc)}
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
                     <span className="count-pill">{sectors.filter(s => s.excavation === exc.id).length} S</span>
                     <ChevronRight size={14} className="arrow" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* COLUMNA 2: SECTORES */}
      <div className={`column ${!selectedExcId ? 'disabled' : ''}`}>
        <div className="column-header">
          <div className="flex-row"><Layers size={14} /><h3>SECTORES</h3></div>
          {selectedExcId && (
            <button 
              onClick={() => (isAddingSector || editingSectorId ? handleCancelSector() : setIsAddingSector(true))} 
              className="btn-icon"
            >
              {isAddingSector || editingSectorId ? <X size={16}/> : <Plus size={16}/>}
            </button>
          )}
        </div>
        <div className="column-content">
          {!selectedExcId ? <div className="empty-state">Selecciona yacimiento</div> : (
            <>
              {/* FORMULARIO DINÁMICO DE SECTOR (ALTA O EDICIÓN) */}
              {(isAddingSector || editingSectorId !== null) && (
                <div className="quick-add-form" style={{ marginBottom: '10px', padding: '10px', borderLeft: editingSectorId ? '3px solid #f59e0b' : 'none' }}>
                  <div className="label-mini" style={{ color: '#f59e0b', marginBottom: '6px', fontWeight: 'bold' }}>
                    {editingSectorId ? '⚠️ MODIFICANDO SECTOR' : 'NUEVO SECTOR'}
                  </div>
                  <input 
                    value={newSectorName}
                    onChange={e => setNewSectorName(e.target.value)}
                    placeholder="Nombre del sector..."
                    className="main-input"
                    style={{ fontSize: '12px', padding: '6px' }}
                  />
                  <button className="btn-save" onClick={handleSaveSector} style={{ fontSize: '11px', padding: '6px' }}>
                    {editingSectorId ? 'ACTUALIZAR SECTOR' : 'GUARDAR SECTOR'}
                  </button>
                </div>
              )}

              <div className="list-wrapper">
                {sectors.filter(s => s.excavation === selectedExcId).map(sec => (
                  <div 
                    key={sec.id} 
                    onClick={() => setSelectedSecId(sec.id)} 
                    className={`nav-card ${selectedSecId === sec.id ? 'active' : ''}`}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                      <h4>{sec.name}</h4>
                      {isAdmin && (
                        <button 
                          onClick={(e) => handleStartEditSector(e, sec)}
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
                    <div className="badge">{ues.filter(u => u.sector === sec.id).length} UEs</div>
                  </div>
                ))}
              </div>
            </>
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