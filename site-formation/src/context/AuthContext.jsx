import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Fonction pour obtenir l'URL de l'API automatiquement
const getApiUrl = () => {
  // Si une URL est définie dans les variables d'environnement, l'utiliser
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Sinon, détecter automatiquement l'URL basée sur l'URL actuelle
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Si on est sur localhost, utiliser localhost pour l'API
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:5000/api`;
  }
  
  // Sinon, utiliser la même IP/hostname que la page actuelle
  return `${protocol}//${hostname}:5000/api`;
};

const API_URL = getApiUrl();

// Configuration axios par défaut
axios.defaults.baseURL = API_URL;

// Log pour debug (peut être retiré en production)
console.log("🌐 API URL configurée:", API_URL);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Configurer le token dans axios si présent
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  // Vérifier le token au chargement
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (credentials, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? "/auth/admin/login" : "/auth/client/login";
      const response = await axios.post(endpoint, credentials);
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Erreur de connexion",
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

