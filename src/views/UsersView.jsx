import React, { useState } from 'react';
import { Shield, UserPlus, X, Edit2, UserCheck } from 'lucide-react';
import './UsersView.css'; 

export function UsersView({ users, loggedUser, onAddUser, onUpdateUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    surname2: '',
    password: '',
    is_superuser: false
  });
  const [errors, setErrors] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'is_superuser') {
      setFormData({
        ...formData,
        is_superuser: value === 'true'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleStartEdit = (userItem) => {
    setEditingUserId(userItem.id);
    setFormData({
      email: userItem.email || '',
      name: userItem.name || '',
      surname: userItem.surname || '',
      surname2: userItem.surname2 || '',
      password: '', 
      is_superuser: userItem.is_superuser || false
    });
    setIsModalOpen(true);
  };

  const handleStartCreate = () => {
    setEditingUserId(null);
    setFormData({ email: '', name: '', surname: '', surname2: '', password: '', is_superuser: false });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setErrors(null);
    setFormData({ email: '', name: '', surname: '', surname2: '', password: '', is_superuser: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    let result;
    if (editingUserId) {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      result = await onUpdateUser(editingUserId, dataToSubmit);
    } else {
      result = await onAddUser(formData);
    }

    if (result.success) {
      handleCloseModal();
    } else {
      setErrors(result.errors);
    }
  };

  return (
    <div className="users-view-container">
      <div className="users-header">
        <div>
          <h3 className="users-subtitle">Core / Acceso de Personal</h3>
          <p className="users-description">Gestión de permisos del sistema Kronos.</p>
        </div>
        <button onClick={handleStartCreate} className="btn-add-user">
          <UserPlus size={16} /> ALTA DE USUARIO
        </button>
      </div>

      <div className="users-grid">
        {users && users.length > 0 ? (
          users.map((u) => (
            <div key={u.id} className="user-card" style={{ position: 'relative' }}>
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
              
              <div className="user-card-footer" style={{ marginBottom: '12px' }}>
                <div className="user-email-box" style={{ width: '100%' }}>
                  <Shield size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
                  <span className="user-email-text" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {u.email}
                  </span>
                </div>
              </div>

              <div style={{ padding: '0 16px 16px 16px' }}>
                <button 
                  type="button"
                  onClick={() => handleStartEdit(u)}
                  style={{
                    width: '100%',
                    background: '#2d251e',
                    border: '1px solid #f59e0b',
                    color: '#f59e0b',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f59e0b';
                    e.currentTarget.style.color = '#1e1b18';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#2d251e';
                    e.currentTarget.style.color = '#f59e0b';
                  }}
                >
                  <Edit2 size={14} /> EDITAR PERFIL
                </button>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-window">
            <div className="modal-header">
              <div>
                <h4 className="modal-title">
                  {editingUserId ? 'Modificar Personal Técnico' : 'Registrar Personal Técnico'}
                </h4>
                <p className="modal-subtitle">Credenciales del sistema Kronos</p>
              </div>
              <button onClick={handleCloseModal} className="btn-close-modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div>
                <label className="form-label">Correo Electrónico</label>
                <input 
                  type="email" name="email" required className="form-input"
                  value={formData.email} onChange={handleInputChange}
                />
                {errors?.email && <p className="form-error-msg">{errors.email[0]}</p>}
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
                <label className="form-label">Rol del Sistema</label>
                <select 
                  name="is_superuser" 
                  className="form-input"
                  style={{ background: '#1e1b18', color: '#fff', width: '100%' }}
                  value={formData.is_superuser.toString()} 
                  onChange={handleInputChange}
                >
                  <option value="false">Operador Técnico (Personal Estándar)</option>
                  <option value="true">Superadministrador (Acceso Total)</option>
                </select>
              </div>

              <div>
                <label className="form-label">
                  Contraseña {editingUserId && <span style={{ fontSize: '11px', color: '#8c857b', marginLeft: '4px' }}>(dejar en blanco para mantener)</span>}
                </label>
                <input 
                  type="password" name="password" required={!editingUserId} className="form-input"
                  value={formData.password} onChange={handleInputChange}
                  placeholder={editingUserId ? "••••••••" : ""}
                />
                {errors?.password && <p className="form-error-msg">{errors.password[0]}</p>}
              </div>

              <button type="submit" className="btn-submit-form" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {editingUserId ? <UserCheck size={16} /> : null}
                {editingUserId ? 'ACTUALIZAR REGISTRO' : 'Grabar en Base de Datos'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}