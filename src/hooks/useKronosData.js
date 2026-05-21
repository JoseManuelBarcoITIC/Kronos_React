import { useState, useEffect } from 'react';
import { authService } from '../services/authService'; 

export function useKronosData() {
  const [excavations, setExcavations] = useState([]);
  const [sectors, setSectors] = useState([]); 
  const [users, setUsers] = useState([]); 
  const [ues, setUes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://152.70.205.28:8000';

  const EXCAVATIONS_URL = `${BASE_URL}/excavations/`; 
  const SECTORS_URL = `${BASE_URL}/sectors/`; 
  const USERS_URL = `${BASE_URL}/users/userlist/`; 
  const UES_URL = `${BASE_URL}/stratigraphic-units/`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = authService.getToken(); 
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [resExc, resSec, resUsr, resUes] = await Promise.all([
        fetch(EXCAVATIONS_URL, { headers }),
        fetch(SECTORS_URL, { headers }), 
        fetch(USERS_URL, { headers }),
        fetch(UES_URL, { headers })
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

      if (resUes.ok) {
        const data = await resUes.json();
        setUes(data);
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

  const addUe = async (newUeData) => {
    const token = authService.getToken();
    try {
      const isFormData = newUeData instanceof FormData;
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(UES_URL, {
        method: 'POST',
        headers: headers,
        body: isFormData ? newUeData : JSON.stringify(newUeData)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Error de validación en Django al crear UE:", data);
        return { success: false, errors: data };
      }

      setUes(prev => [...prev, data]);
      return { success: true, data };

    } catch (err) {
      console.error("Fallo crítico de red en la petición addUe:", err);
      return { success: false, errors: { detail: err.message } };
    }
  };

  const updateUe = async (id, updatedUeData) => {
    const token = authService.getToken();
    console.log("=== INICIO DE EDICIÓN UE ===");
    
    try {
      const isFormData = updatedUeData instanceof FormData;
      let bodyPayload;

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      if (isFormData) {
        if (updatedUeData.has('_method')) {
          updatedUeData.delete('_method');
        }
        bodyPayload = updatedUeData;
      } else {
        headers['Content-Type'] = 'application/json';
        bodyPayload = JSON.stringify(updatedUeData);
      }
      
      const targetUrl = `${UES_URL}${id}/`;
      console.log(`Enviando PATCH nativo a: ${targetUrl}`);

      const response = await fetch(targetUrl, {
        method: 'PATCH',
        headers: headers,
        body: bodyPayload
      });

      console.log("Estado de respuesta HTTP del servidor:", response.status);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("❌ ERROR DETECTADO EN EL BACKEND (Django):", data);
        return { success: false, errors: data };
      }

      console.log("✅ UE actualizada con éxito en Kronos. Respuesta:", data);
      setUes(prev => prev.map(ue => ue.id === id ? data : ue));
      return { success: true, data };

    } catch (err) {
      console.error("💥 FALLO CRÍTICO DE RED:", err);
      return { success: false, errors: { detail: err.message } };
    } finally {
      console.log("=== FIN DE EDICIÓN UE ===");
    }
  };

  return { 
    excavations, 
    sectors, 
    users, 
    ues, 
    addExcavation, 
    updateExcavation, 
    addSector, 
    updateSector,
    addUser, 
    updateUser, 
    addUe, 
    updateUe,
    loading, 
    error 
  };
}