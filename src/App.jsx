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

  const { 
    users, 
    excavations, 
    sectors, 
    ues,
    addExcavation, 
    updateExcavation, 
    addSector,         
    updateSector,
    addUser, 
    updateUser, 
    addUe,
    updateUe,
    loading 
  } = useKronosData(token); 

  const isAdmin = currentUser?.is_staff === true || currentUser?.is_superuser === true;

  const handleLoginSuccess = (loginData) => {
    setToken(loginData.access);
    setCurrentUser(loginData.user);
  };

  if (!token) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f4f1ea' }}>
        <p style={{ color: '#4B3621', fontWeight: 'bold', letterSpacing: '0.1em' }}>SINCRONIZANDO CON KRONOS...</p>
      </div>
    );
  }

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
              ues={ues}
              user={currentUser} 
              onAddExcavation={addExcavation}
              onUpdateExcavation={updateExcavation} 
              onAddSector={addSector}       
              onUpdateSector={updateSector}       
              onAddUe={addUe}
              onUpdateUe={updateUe}
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