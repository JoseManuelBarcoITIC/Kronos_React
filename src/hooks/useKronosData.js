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
        console.error("Error real de Django:", data);
        throw new Error(data.detail || "Error al crear la excavación");
      }

      setExcavations(prev => [...prev, data]);
      return data;

    } catch (err) {
      console.error("Error en la petición addExcavation:", err);
      setError(err.message);
      throw err; 
    }
  };

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
        console.error("Error real de Django al crear sector:", data);
        throw new Error(data.detail || "Error al crear el sector");
      }

      setSectors(prev => [...prev, data]);
      return data;

    } catch (err) {
      console.error("Error en la petición addSector:", err);
      setError(err.message);
      throw err;
    }
  };

  // ➕ NUEVA FUNCIÓN: Envía el POST a Django para dar de alta un usuario
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

  return { 
    excavations, 
    sectors, 
    users, 
    addExcavation, 
    addSector, 
    addUser, 
    loading, 
    error 
  };
}