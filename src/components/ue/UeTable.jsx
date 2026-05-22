import React from 'react';
import { Trash2, Edit, Image as ImageIcon, GitCommit } from 'lucide-react';

export function UeTable({ ues, onEditUe, onDeleteUe }) {
  const API_BASE_URL = 'http://152.70.205.28:8000';

  const getRelationLabel = (type) => {
    const labels = {
      'covers': 'Cubre a',
      'fills': 'Rellena a',
      'cuts': 'Corta a',
      'leans': 'Se apoya en',
      'abuts': 'Adosado a',
      'equal': 'Igual a'
    };
    return labels[type] || type;
  };

  return (
    <table className="kronos-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>TIPO</th>
          <th>RELACIONES (HARRIS)</th>
          <th>REGISTRO GRÁFICO</th>
          <th className="text-right">ACCIONES</th>
        </tr>
      </thead>
      <tbody>
        {ues.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No hay unidades estratigráficas registradas en este sector.
            </td>
          </tr>
        ) : (
          ues.map(ue => {
            const photoUrl = ue.site_photo 
              ? (ue.site_photo.startsWith('http') ? ue.site_photo : `${API_BASE_URL}${ue.site_photo}`)
              : null;

            return (
              <tr key={ue.id}>
                <td className="ue-id">UE-{ue.ue_number}</td>
                <td><span className="type-tag">{ue.definition}</span></td>
                
                <td>
                  {ue.relations && ue.relations.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {ue.relations.map((rel, idx) => (
                        <span 
                          key={idx} 
                          style={{ 
                            fontSize: '11px', 
                            background: '#2a2a2a', 
                            color: '#ffb703', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            border: '1px solid #444',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span style={{ color: '#aaa', fontStyle: 'italic' }}>{getRelationLabel(rel.type_relation)}</span>
                          <strong>UE-{rel.ue_number}</strong>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '11px', color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GitCommit size={12} /> Aislada
                    </span>
                  )}
                </td>

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

                <td className="text-right">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                    <button 
                      className="btn-edit"
                      onClick={() => onEditUe && onEditUe(ue)}
                      style={{ 
                        cursor: 'pointer', 
                        background: 'transparent', 
                        border: 'none', 
                        color: '#ffb703', 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '4px' 
                      }}
                      title="Editar ficha de la UE"
                    >
                      <Edit size={14}/>
                    </button>

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