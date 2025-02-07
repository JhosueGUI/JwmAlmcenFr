import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';

export const AuthProvider = ({ children }) => {
  const [autenticadoState, setAutenticadoState] = useState({
    autenticado: false,
    id: '',
    personal_id: '',
    persona: null,
    username: '',
    token: '',
    roles: [],
    accesos: []
  });
  const [mensaje, setMensaje] = useState(false);

  const login = async (username, password) => {
    try {
      const respuesta = await axios.post("http://127.0.0.1:8000/api/login", {
        username,
        password
    });
    const { token, id, personal_id, persona, username: userUsername, roles, accesos } = respuesta.data;
    

      setAutenticadoState({
        autenticado: true,
        id,
        personal_id,
        persona,
        username: userUsername,
        token,
        roles,
        accesos
      });

      localStorage.setItem('usuario', JSON.stringify({
        autenticado: true,
        id,
        personal_id,
        persona,
        username: userUsername,
        token,
        roles,
        accesos
      }));
      console.log('Usuario almacenado en localStorage:', localStorage.getItem('usuario')); // Log para verificar almacenamiento
      setMensaje(false);
    } catch (error) {
      setMensaje(true);
      console.error('Error en el login:', error); // Log para errores
    }
  };

  const logout = () => {
    setAutenticadoState({
      autenticado: false,
      id: '',
      personal_id: '',
      persona: null,
      username: '',
      token: '',
      roles: [],
      accesos: []
    });
    localStorage.removeItem('usuario');
    console.log('Usuario removido de localStorage'); // Log para verificar eliminación
  };

  useEffect(() => {
    const autenticado = JSON.parse(localStorage.getItem('usuario')) || {
      autenticado: false,
      id: '',
      personal_id: '',
      persona: null,
      username: '',
      token: '',
      roles: [],
      accesos: []
    };
    setAutenticadoState(autenticado);
    console.log('Usuario cargado desde localStorage:', autenticado); // Log para verificar carga
  }, []);
  const obtenerToken = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario ? usuario.token : null;
  };
  const provider = {
    autenticadoState,
    setAutenticadoState,
    login,
    logout,
    mensaje,
    obtenerToken
  };

  return (
    <AuthContext.Provider value={provider}>
      {children}
    </AuthContext.Provider>
  );
};
