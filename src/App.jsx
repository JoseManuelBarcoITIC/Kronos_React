import React, { useState } from 'react';
import { authService } from './services/authService';
import { useKronosData } from './hooks/useKronosData';
import { Sidebar } from './components/layout/Sidebar';
import { LoginView } from './views/LoginView';
import { UnifiedView } from './views/UnifiedView';
import { UsersView } from './views/UsersView'; // ➕ Importamos la nueva vista modular estilizada

export default function App() {
  const [token, setToken] = useState(authService.getToken());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [view, setView] = useState('core');

  // 🔄 Estado reactivo para el usuario conectado (evita desfases en el primer login)
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  // Extraemos todas las utilidades de nuestro Hook sincronizado con Django
  const { 
    users, 
    excavations, 
    sectors, 
    addExcavation, 
    addSector, 
    addUser, // ➕ Extraemos la nueva función POST para personal
    loading 
  } = useKronosData();

  // Evaluamos los permisos en base al estado reactivo del usuario
  const isAdmin = currentUser?.is_staff === true || currentUser?.is_superuser === true;

  // Manejador del éxito del login para actualizar token y usuario al unísono
  const handleLoginSuccess = (loginData) => {
    setToken(loginData.access);
    setCurrentUser(loginData.user);
  };

  // 🔒 Guardafrenos: Si no hay sesión válida, renderiza el Login
  if (!token) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // ⏳ Pantalla de carga mientras se sincroniza el Promise.all de useKronosData
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f1ea' }}>
        <p style={{ color: '#4B3621', fontWeight: 'bold', tracking: '0.1em' }}>SINCRONIZANDO CON KRONOS...</p>
      </div>
    );
  }

  return (
    <div className="app-viewport">
      {/* BARRA LATERAL */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        view={view} 
        setView={setView} 
        user={currentUser}
        isAdmin={isAdmin} 
        onLogout={() => { 
          authService.logout(); 
          setToken(null); 
          setCurrentUser(null); 
        }}
      />
      
      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div className="content-area">
          
          {/* Vista 1: Control Técnico Arqueológico */}
          {view === 'core' && (
            <UnifiedView
              excavations={excavations}
              users={users}
              sectors={sectors} 
              onAddExcavation={addExcavation}
              onAddSector={addSector} 
            />
          )}
          
          {/* Vista 2: Gestión e Inserción de Personal Autenticado */}
          {view === 'users' && isAdmin && (
            <UsersView 
              users={users} 
              loggedUser={currentUser} 
              onAddUser={addUser} // ➕ Enlazamos la acción del modal al backend
            />
          )}
          
        </div>
      </main>
    </div>
  );
}