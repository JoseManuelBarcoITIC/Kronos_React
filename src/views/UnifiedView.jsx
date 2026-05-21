import React, { useState } from 'react';
import { Trash2, Plus, X, ArrowLeft, Save, FileText, Image, Database, Layers } from 'lucide-react';

import { ExcavationForm } from '../components/excavations/ExcavationForm';
import { ExcavationCard } from '../components/excavations/ExcavationCard';
import { SectorForm } from '../components/sector/SectorForm';
import { SectorCard } from '../components/sector/SectorCard';
import { UeTable } from '../components/ue/UeTable';

import './UnifiedView.css';

export function UnifiedView({ 
  excavations = [], users = [], sectors = [], ues = [], user = null, 
  onAddExcavation, onUpdateExcavation, onAddSector, onUpdateSector, onAddUe, onUpdateUe, onDeleteUe
}) {
  const [selectedExcId, setSelectedExcId] = useState(null);
  const [selectedSecId, setSelectedSecId] = useState(null);
  
  const [isAddingExc, setIsAddingExc] = useState(false);
  const [editingExc, setEditingExc] = useState(null);

  const [isAddingSector, setIsAddingSector] = useState(false);
  const [editingSector, setEditingSector] = useState(null);

  const [showUePortal, setShowUePortal] = useState(false);
  const [editingUe, setEditingUe] = useState(null); 

  const isAdmin = user && (user.is_staff === true || user.is_superuser === true);

  const visibleExcavations = excavations.filter(exc => {
    if (isAdmin) return true; 
    return exc.users?.some(u => (typeof u === 'object' ? u.id : u) === user?.id);
  });

  const handleSaveExcavation = async (data) => {
    if (editingExc) {
      if (onUpdateExcavation) await onUpdateExcavation(editingExc.id, data);
    } else {
      if (onAddExcavation) await onAddExcavation(data);
    }
    setIsAddingExc(false);
    setEditingExc(null);
  };

  const handleSaveSector = async (name) => {
    if (!selectedExcId) return;
    if (editingSector) {
      if (onUpdateSector) await onUpdateSector(editingSector.id, { name, value: selectedExcId });
    } else {
      if (onAddSector) await onAddSector({ name, value: selectedExcId });
    }
    setIsAddingSector(false);
    setEditingSector(null);
  };

  const handlePortalSubmit = async (formData) => {
    if (editingUe) {
      if (formData.has('sector')) {
        formData.set('sector', parseInt(selectedSecId, 10));
      } else {
        formData.append('sector', parseInt(selectedSecId, 10));
      }

      if (onUpdateUe) {
        const result = await onUpdateUe(editingUe.id, formData);
        if (result && result.success === false && result.errors) {
          alert(`❌ Error al actualizar en Kronos:\n${JSON.stringify(result.errors)}`);
          return;
        }
      }
    } else {
      formData.append('sector', parseInt(selectedSecId, 10));
      if (onAddUe) {
        const result = await onAddUe(formData);
        if (result && result.success === false && result.errors) {
          alert(`❌ Error de validación en Kronos (Django):\n${JSON.stringify(result.errors)}`);
          return;
        }
      }
    }
    setShowUePortal(false);
    setEditingUe(null);
  };

  const handleStartEditUe = (ue) => {
    setEditingUe(ue);
    setShowUePortal(true);
  };

  if (showUePortal) {
    const currentSectorName = sectors.find(s => s.id === selectedSecId)?.name || 'Sector';
    return (
      <UeFormPortal 
        sectorName={currentSectorName}
        initialData={editingUe} 
        onClose={() => { setShowUePortal(false); setEditingUe(null); }}
        onSubmit={handlePortalSubmit}
      />
    );
  }

  return (
    <div className="triple-column-layout">
      
      <div className="column">
        <div className="column-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="flex-row">
            <Database size={14} className="text-amber" />
            <h3>YACIMIENTOS {!isAdmin && "ASIGNADOS"}</h3>
          </div>
          {isAdmin && (
            <button 
              onClick={() => { setEditingExc(null); setIsAddingExc(!isAddingExc); }} 
              className="btn-icon"
            >
              {isAddingExc || editingExc ? <X size={16}/> : <Plus size={16}/>}
            </button>
          )}
        </div>
        
        <div className="column-content">
          {(isAddingExc || editingExc) && (
            <ExcavationForm 
              users={users}
              initialData={editingExc}
              onSave={handleSaveExcavation}
              onCancel={() => { setIsAddingExc(false); setEditingExc(null); }}
            />
          )}

          <div className="list-wrapper">
            {visibleExcavations.length === 0 ? (
              <div className="empty-state">No tienes yacimientos asignados</div>
            ) : (
              visibleExcavations.map(exc => (
                <ExcavationCard 
                  key={exc.id}
                  exc={exc}
                  sectors={sectors}
                  isActive={selectedExcId === exc.id}
                  isAdmin={isAdmin}
                  onSelect={() => { setSelectedExcId(exc.id); setSelectedSecId(null); setIsAddingSector(false); setEditingSector(null); }}
                  onStartEdit={(target) => { setEditingExc(target); setIsAddingExc(false); }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className={`column ${!selectedExcId ? 'disabled' : ''}`}>
        <div className="column-header">
          <div className="flex-row"><Layers size={14} /><h3>SECTORES</h3></div>
          {selectedExcId && (
            <button 
              onClick={() => { setEditingSector(null); setIsAddingSector(!isAddingSector); }} 
              className="btn-icon"
            >
              {isAddingSector || editingSector ? <X size={16}/> : <Plus size={16}/>}
            </button>
          )}
        </div>
        <div className="column-content">
          {!selectedExcId ? <div className="empty-state">Selecciona yacimiento</div> : (
            <>
              {(isAddingSector || editingSector) && (
                <SectorForm 
                  initialName={editingSector ? editingSector.name : ''}
                  onSave={handleSaveSector}
                  onCancel={() => { setIsAddingSector(false); setEditingSector(null); }}
                />
              )}

              <div className="list-wrapper">
                {sectors.filter(s => s.excavation === selectedExcId).map(sec => (
                  <SectorCard 
                    key={sec.id}
                    sec={sec}
                    ues={ues}
                    isActive={selectedSecId === sec.id}
                    isAdmin={isAdmin}
                    onSelect={() => setSelectedSecId(sec.id)}
                    onStartEdit={(target) => { setEditingSector(target); setIsAddingSector(false); }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`column flex-grow ${!selectedSecId ? 'disabled' : ''}`}>
        <div className="column-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h3>REGISTROS UE</h3>
          {selectedSecId && (
            <button onClick={() => { setEditingUe(null); setShowUePortal(true); }} className="btn-icon" style={{ background: '#f59e0b', color: '#000' }}>
              <Plus size={16}/>
            </button>
          )}
        </div>
        <div className="column-content">
          {selectedSecId ? (
            <UeTable 
              ues={ues.filter(u => u.sector === selectedSecId)} 
              onEditUe={handleStartEditUe} 
              onDeleteUe={onDeleteUe}      
            />
          ) : <div className="empty-state">Selecciona un sector</div>}
        </div>
      </div>

    </div>
  );
}

function UeFormPortal({ sectorName, initialData, onClose, onSubmit }) {
  const [number, setNumber] = useState(initialData ? initialData.ue_number : '');
  const [definition, setDefinition] = useState(initialData ? initialData.definition : 'layer');
  const [description, setDescription] = useState(initialData ? initialData.description : '');
  
  const [length, setLength] = useState(initialData ? initialData.length || '' : '');
  const [width, setWidth] = useState(initialData ? initialData.width || '' : '');
  const [height, setHeight] = useState(initialData ? initialData.height || '' : '');
  const [topElevation, setTopElevation] = useState(initialData ? initialData.top_elevation || '' : '');
  const [bottomElevation, setBottomElevation] = useState(initialData ? initialData.bottom_elevation || '' : '');
  
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (!number || String(number).trim() === '') {
      alert("⚠️ El número identificador de la Unidad Estratigráfica es obligatorio.");
      return;
    }

    const formData = new FormData();
    formData.append('ue_number', parseInt(number, 10));
    formData.append('definition', definition);
    formData.append('description', description || '');
    
    if (length !== '' && length !== null) formData.append('length', parseFloat(length));
    if (width !== '' && width !== null) formData.append('width', parseFloat(width));
    if (height !== '' && height !== null) formData.append('height', parseFloat(height));
    if (topElevation !== '' && topElevation !== null) formData.append('top_elevation', parseFloat(topElevation));
    if (bottomElevation !== '' && bottomElevation !== null) formData.append('bottom_elevation', parseFloat(bottomElevation));
    
    formData.append('sheet_data', JSON.stringify({}));

    if (selectedFile) {
      formData.append('site_photo', selectedFile);
    }

    onSubmit(formData);
  };

  return (
    <div className="ue-portal-container" style={{ padding: '24px', background: '#1a1a1a', borderRadius: '8px', minHeight: '80vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '16px', marginBottom: '24px' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
          <ArrowLeft size={16} /> Volver al Yacimiento
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} style={{ color: '#f59e0b' }} />
          <h2 style={{ margin: 0, fontSize: '20px', letterSpacing: '0.05em' }}>
            {initialData ? `EDITANDO CONTROL UE-${initialData.ue_number}` : 'NUEVA FICHA DE UNIDAD ESTRATIGRÁFICA'}
          </h2>
        </div>
        <span style={{ fontSize: '12px', background: '#333', padding: '4px 8px', borderRadius: '4px', color: '#f59e0b', fontWeight: 'bold' }}>
          {sectorName.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px', fontWeight: 'bold' }}>NÚMERO DE LA UNIDAD (IDENTIFICADOR)</label>
              <input type="number" value={number} onChange={e => setNumber(e.target.value)} placeholder="Ej. 1025" style={{ width: '100%', padding: '12px', background: '#252525', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px', fontWeight: 'bold' }}>TIPO DE UNIDAD ESTRATIGRÁFICA</label>
              <select value={definition} onChange={e => setDefinition(e.target.value)} style={{ width: '100%', padding: '12px', background: '#252525', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '14px' }}>
                <option value="layer">Estratigráfica (Capa, Sedimento...)</option>
                <option value="structure">Estructural (Muro, Estructura...)</option>
                <option value="cut">Interfaz / Corte (Fosa, Zanja...)</option>
              </select>
            </div>
          </div>
          <div style={{ flex: '2', minWidth: '320px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px', fontWeight: 'bold' }}>DESCRIPCIÓN ARQUEOLÓGICA</label>
            <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe la composición física, color, consistencia..." style={{ width: '100%', padding: '12px', background: '#252525', border: '1px solid #444', color: '#fff', borderRadius: '4px', fontSize: '14px', resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ background: '#202020', padding: '16px', borderRadius: '6px', border: '1px solid #333' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#f59e0b', fontSize: '13px', letterSpacing: '0.05em' }}>DIMENSIONES MÉTRICAS Y COTAS</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '120px' }}><label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '4px' }}>Longitud (m)</label><input type="number" step="0.01" value={length} onChange={e => setLength(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '8px', background: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} /></div>
            <div style={{ flex: '1', minWidth: '120px' }}><label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '4px' }}>Anchura (m)</label><input type="number" step="0.01" value={width} onChange={e => setWidth(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '8px', background: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} /></div>
            <div style={{ flex: '1', minWidth: '120px' }}><label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '4px' }}>Potencia (m)</label><input type="number" step="0.01" value={height} onChange={e => setHeight(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '8px', background: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} /></div>
            <div style={{ flex: '1', minWidth: '120px' }}><label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '4px' }}>Cota Sup (z)</label><input type="number" step="0.01" value={topElevation} onChange={e => setTopElevation(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '8px', background: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} /></div>
            <div style={{ flex: '1', minWidth: '120px' }}><label style={{ display: 'block', fontSize: '11px', color: '#888', marginBottom: '4px' }}>Cota Inf (z)</label><input type="number" step="0.01" value={bottomElevation} onChange={e => setBottomElevation(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '8px', background: '#2a2a2a', border: '1px solid #444', color: '#fff', borderRadius: '4px' }} /></div>
          </div>
        </div>

        <div style={{ background: '#202020', padding: '16px', borderRadius: '6px', border: '1px solid #333' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#f59e0b', fontSize: '13px', letterSpacing: '0.05em' }}>REGISTRO GRÁFICO</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <label style={{ cursor: 'pointer', padding: '10px 16px', background: '#333', border: '1px dashed #555', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Image size={16} style={{ color: '#f59e0b' }} /> {initialData ? 'Cambiar fotografía de campo' : 'Subir fotografía de campo'}
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
            <span style={{ fontSize: '12px', color: selectedFile || (initialData && initialData.site_photo) ? '#f59e0b' : '#666' }}>
              {selectedFile ? `📸 Listo: ${selectedFile.name}` : (initialData && initialData.site_photo ? '📸 Conservar imagen actual' : 'Ninguna imagen seleccionada')}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', borderTop: '1px solid #333', paddingTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} style={{ padding: '12px 24px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> {initialData ? 'GUARDAR CAMBIOS EN KRONOS' : 'GUARDAR FICHA EN KRONOS'}
        </button>
      </div>
    </div>
  );
}