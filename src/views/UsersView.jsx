import React, { useState } from 'react';
import { Shield, UserPlus, MoreVertical, X } from 'lucide-react';
import './UsersView.css'; // ➕ Vinculamos el nuevo archivo CSS

export function UsersView({ users, loggedUser, onAddUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    surname2: '',
    password: ''
  });
  const [errors, setErrors] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    const result = await onAddUser(formData);

    if (result.success) {
      setFormData({ email: '', name: '', surname: '', surname2: '', password: '' });
      setIsModalOpen(false);
    } else {
      setErrors(result.errors);
    }
  };

  return (
    <div className="users-view-container">
      {/* SECCIÓN CABECERA */}
      <div className="users-header">
        <div>
          <h3 className="users-subtitle">Core / Acceso de Personal</h3>
          <p className="users-description">Gestión de permisos del sistema Kronos.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-add-user">
          <UserPlus size={16} /> ALTA DE USUARIO
        </button>
      </div>

      {/* REJILLA DE USUARIOS */}
      <div className="users-grid">
        {users && users.length > 0 ? (
          users.map((u) => (
            <div key={u.id} className="user-card">
              <div className="user-profile-info">
                <div className="user-avatar">
                  {(u.name || u.email || "U")[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="user-name">
                    {u.name ? `${u.name} ${u.surname || ''}` : u.email.split('@')[0]}
                  </h4>
                  <p className="user-role-tag">
                    {u.is_superuser ? 'Superadmin' : u.is_staff ? 'Staff' : 'Operador'}
                  </p>
                </div>
              </div>
              
              <div className="user-card-footer">
                <div className="user-email-box">
                  <Shield size={12} className="text-amber-500" style={{ color: '#f59e0b' }} />
                  <span className="user-email-text">{u.email}</span>
                </div>
                <button className="btn-card-actions"><MoreVertical size={16} /></button>
              </div>

              {u.id === loggedUser?.id && (
                <div className="self-badge">TÚ</div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-grid-state">
            <p className="empty-grid-text">No hay registros de personal en el Core</p>
          </div>
        )}
      </div>

      {/* MODAL DE ALTA FLOTANTE */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-window">
            
            {/* Cabecera del Modal */}
            <div className="modal-header">
              <div>
                <h4 className="modal-title">Registrar Personal Técnico</h4>
                <p className="modal-subtitle">Credenciales del sistema Kronos</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); setErrors(null); }} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>

            {/* Formulario de Alta */}
            <form onSubmit={handleSubmit} className="modal-form">
              <div>
                <label className="form-label">Correo Electrónico</label>
                <input 
                  type="email" name="email" required className="form-input"
                  value={formData.email} onChange={handleInputChange}
                />
                {errors?.email && <p className="form-error-msg">⚠️ {errors.email[0]}</p>}
              </div>

              <div className="form-group-row">
                <div>
                  <label className="form-label">Nombre</label>
                  <input 
                    type="text" name="name" required className="form-input"
                    value={formData.name} onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="form-label">Primer Apellido</label>
                  <input 
                    type="text" name="surname" required className="form-input"
                    value={formData.surname} onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Segundo Apellido</label>
                <input 
                  type="text" name="surname2" className="form-input"
                  value={formData.surname2} onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="form-label">Contraseña</label>
                <input 
                  type="password" name="password" required className="form-input"
                  value={formData.password} onChange={handleInputChange}
                />
                {errors?.password && <p className="form-error-msg">⚠️ {errors.password[0]}</p>}
              </div>

              <button type="submit" className="btn-submit-form">
                Grabar en Base de Datos
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}