import React from 'react';
import { Trash2, Edit, Image as ImageIcon } from 'lucide-react';

export function UeTable({ ues, onEditUe, onDeleteUe }) {
  // ─── CONFIGURACIÓN DE TU SERVIDOR DJANGO ───
  const API_BASE_URL = 'http://152.70.205.28:8000';

  return (
    <table className="kronos-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>TIPO</th>
          <th>REGISTRO GRÁFICO</th>
          <th className="text-right">ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        {ues.length === 0 ? (
          <tr>
            <td colSpan="4" style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No hay unidades estratigráficas registradas en este sector.
            </td>
          </tr>
        ) : (
          ues.map(ue => {
            // Evaluamos si la URL ya es absoluta o si es relativa para concatenarle la IP
            const photoUrl = ue.site_photo 
              ? (ue.site_photo.startsWith('http') ? ue.site_photo : `${API_BASE_URL}${ue.site_photo}`)
              : null;

            return (
              <tr key={ue.id}>
                <td className="ue-id">UE-{ue.ue_number}</td>
                <td><span className="type-tag">{ue.definition}</span></td>
                
                {/* ─── RENDERIZADO DE LA IMAGEN ─── */}
                <td>
                  {photoUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a 
                        href={photoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        title="Click para ver en grande"
                      >
                        <img 
                          src={photoUrl} 
                          alt={`Campo UE ${ue.ue_number}`} 
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover', 
                            borderRadius: '4px',
                            border: '1px solid #444',
                            display: 'block',
                            cursor: 'pointer'
                          }} 
                        />
                      </a>
                    </div>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ImageIcon size={12} /> Sin foto
                    </span>
                  )}
                </td>

                {/* ─── COLUMNA DE ACCIONES (EDICIÓN + ELIMINACIÓN) ─── */}
                <td className="text-right">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                    {/* Botón de Editar Registro */}
                    <button 
                      className="btn-edit"
                      onClick={() => onEditUe && onEditUe(ue)}
                      style={{ 
                        cursor: 'pointer', 
                        background: 'transparent', 
                        border: 'none', 
                        color: '#ffb703', // Color amarillo Kronos para mantener consistencia
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px'
                      }}
                      title="Editar ficha de la UE"
                    >
                      <Edit size={14}/>
                    </button>

                    {/* Botón de Eliminar */}
                    <button 
                      className="btn-del" 
                      onClick={() => onDeleteUe && onDeleteUe(ue.id)}
                      style={{ cursor: 'pointer' }}
                      title="Desactivar UE"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}