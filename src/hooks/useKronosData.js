import { useState, useEffect } from 'react';
import { authService } from '../services/authService'; 

export function useKronosData() {
  const [excavations, setExcavations] = useState([]);
  const [sectors, setSectors] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:8000';

  const EXCAVATIONS_URL = `${BASE_URL}/excavations/`; 
  const SECTORS_URL = `${BASE_URL}/sectors/`; 
  const USERS_URL = `${BASE_URL}/users/userlist/`; 

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = authService.getToken(); 
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [resExc, resSec, resUsr] = await Promise.all([
        fetch(EXCAVATIONS_URL, { headers }),
        fetch(SECTORS_URL, { headers }), 
        fetch(USERS_URL, { headers })
      ]);

      if (resExc.ok) {
        const data = await resExc.json();
        setExcavations(data);
      }

      if (resSec.ok) {
        const data = await resSec.json();
        setSectors(data); 
      }

      if (resUsr.ok) {
        const data = await resUsr.json();
        setUsers(data);
      }

    } catch (err) {
      console.error("Error Kronos Sync:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addExcavation = async (newExcData) => {
    const token = authService.getToken();
    try {
      const response = await fetch(EXCAVATIONS_URL, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(newExcData) 
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { success: false, errors: data };
      }

      setExcavations(prev => [...prev, data]);
      return { success: true, data };

    } catch (err) {
      console.error("Fallo de red en la petición addExcavation:", err);
      return { success: false, errors: { detail: err.message } };
    }
  };

  // 🔄 OPTIMIZADO: Retorno limpio de errores para Sectores
  const addSector = async (newSecData) => {
    const token = authService.getToken();
    try {
      const response = await fetch(SECTORS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSecData)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Error de validación en Django al crear sector:", data);
        return { success: false, errors: data };
      }

      setSectors(prev => [...prev, data]);
      return { success: true, data };

    } catch (err) {
      console.error("Error en la petición addSector:", err);
      return { success: false, errors: { detail: err.message } };
    }
  };

  const updateSector = async (id, updatedData) => {
    const token = authService.getToken();
    try {
      const response = await fetch(`${SECTORS_URL}${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Error de Django al actualizar el sector:", data);
        return { success: false, errors: data };
      }

      setSectors(prev => prev.map(sec => sec.id === id ? data : sec));
      return { success: true, data };

    } catch (err) {
      console.error("Error en la petición updateSector:", err);
      return { success: false, errors: { detail: err.message } };
    }
  };

  const addUser = async (newUserData) => {
    const token = authService.getToken();
    try {
      const response = await fetch(USERS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newUserData)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Error de validación en Django al crear usuario:", data);
        return { success: false, errors: data };
      }

      setUsers(prev => [...prev, data]);
      return { success: true, data };

    } catch (err) {
      console.error("Fallo de red en la petición addUser:", err);
      return { success: false, errors: { detail: err.message } };
    }
  };

  const updateUser = async (id, updatedUserData) => {
    const token = authService.getToken();
    try {
      const response = await fetch(`${BASE_URL}/users/user/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUserData)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Error de validación en Django al actualizar usuario:", data);
        return { success: false, errors: data };
      }

      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
      return { success: true, data };

    } catch (err) {
      console.error("Fallo de red en la petición updateUser:", err);
      return { success: false, errors: { detail: err.message } };
    }
  };

  // 🔄 OPTIMIZADO: Retorno de errores controlado para actualización de Excavaciones
  const updateExcavation = async (id, updatedData) => {
    const token = authService.getToken();
    try {
      const response = await fetch(`${EXCAVATIONS_URL}${id}/`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData)
      });
      
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Error de Django al actualizar yacimiento:", data);
        return { success: false, errors: data };
      }

      setExcavations(prev => prev.map(exc => exc.id === id ? data : exc));
      return { success: true, data };
      
    } catch (err) {
      console.error("Error en la petición updateExcavation:", err);
      return { success: false, errors: { detail: err.message } };
    }
  };  

  return { 
    excavations, 
    sectors, 
    users, 
    addExcavation, 
    updateExcavation, 
    addSector, 
    updateSector,
    addUser, 
    updateUser, 
    loading, 
    error 
  };
}