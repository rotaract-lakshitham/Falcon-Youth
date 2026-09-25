import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('falconAdminToken');
    const user  = localStorage.getItem('falconAdminUser');
    if (token && user) setAdmin(JSON.parse(user));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('falconAdminToken', data.token);
    localStorage.setItem('falconAdminUser', JSON.stringify({ username: data.username, role: data.role }));
    setAdmin({ username: data.username, role: data.role });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('falconAdminToken');
    localStorage.removeItem('falconAdminUser');
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
