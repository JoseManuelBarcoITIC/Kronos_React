import React, { useState } from 'react';
import { authService } from './services/authService';
import { useKronosData } from './hooks/useKronosData';
import { Sidebar } from './components/layout/Sidebar';
import { LoginView } from './views/LoginView';
import { UnifiedView } from './views/UnifiedView';
import { UsersView } from './views/UsersView';

export default function App() {
  const [token, setToken] = useState(authService.getToken());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [view, setView] = useState('core');
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  // 1. 🔄 PASAMOS EL TOKEN AL HOOK para que reaccione al login
  const { 
    users, 
    excavations, 
    sectors, 
    addExcavation, 
    updateExcavation, 
    addSector,        
    updateSector,
    addUser, 
    updateUser, 
    loading 
  } = useKronosData(token); 

  const isAdmin = currentUser?.is_staff === true || currentUser?.is_superuser === true;

  const handleLoginSuccess = (loginData) => {
    setToken(loginData.access);
    setCurrentUser(loginData.user);
  };

  // 2. 🔀 PRIORIDAD 1: Si no hay token, renderizar Login inmediatamente
  if (!token) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // 3. ⏳ PRIORIDAD 2: Si ya hay token pero el hook está consultando a Django, mostrar loading
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f1ea' }}>
        <p style={{ color: '#4B3621', fontWeight: 'bold', letterSpacing: '0.1em' }}>SINCRONIZANDO CON KRONOS...</p>
      </div>
    );
  }

  // 4. ✅ PRIORIDAD 3: Render de la aplicación con datos listos
  return (
    <div className="app-viewport">
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
      
      <main className="main-content">
        <div className="content-area">
          
          {view === 'core' && (
            <UnifiedView
              excavations={excavations}
              users={users}
              sectors={sectors} 
              user={currentUser} 
              onAddExcavation={addExcavation}
              onUpdateExcavation={updateExcavation} 
              onAddSector={addSector}       
              onUpdateSector={updateSector}       
            />
          )}
          
          {view === 'users' && isAdmin && (
            <UsersView 
              users={users} 
              loggedUser={currentUser} 
              onAddUser={addUser} 
              onUpdateUser={updateUser}
            />
          )}
  
        </div>
      </main>
    </div>
  );
}