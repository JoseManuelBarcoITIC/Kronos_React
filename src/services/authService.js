// src/services/authService.js

const API_URL = 'http://localhost:8000/users/login/'; 

export const authService = {
  login: async (email, password) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 🔄 Tu serializer pide 'email', se lo enviamos tal cual
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error devuelto por Django:", errorData);
        throw new Error(errorData.detail || 'Error de autenticación');
      }

      const data = await response.json();
      
      // Guardamos el token de acceso
      if (data.access) {
        localStorage.setItem('kronos_token', data.access);
      }

      // 💾 Guardamos el objeto 'user' que construiste en tu serializer
      if (data.user) {
        localStorage.setItem('kronos_user', JSON.stringify(data.user));
      }

      return data; 
      
    } catch (error) {
      console.error("Fallo en la comunicación con el servidor de Kronos:", error);
      throw error;
    }
  },

  getToken: () => {
    return localStorage.getItem('kronos_token') || null;
  },

  // Extrae el objeto de usuario directamente guardado en el localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('kronos_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr); // Devuelve { id, email, is_staff, is_superuser }
    } catch (e) {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('kronos_token');
    localStorage.removeItem('kronos_user');
  }
};