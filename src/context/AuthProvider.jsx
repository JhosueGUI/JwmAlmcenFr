import { useState, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import axios from 'axios';

const estadoInicialAutenticacion = {
  autenticado: false,
  id: '',
  personal_id: '',
  persona: null,
  username: '',
  token: '',
  roles: [],
  accesos: []
};

export const AuthProvider = ({ children }) => {
  const toast = useRef(null);

  const [cargandoLogin, setCargandoLogin] = useState(false);

  const [autenticadoState, setAutenticadoState] = useState(estadoInicialAutenticacion);

  const [mensajeError, setMensajeError] = useState('');

  const actualizarEstadoAutenticacion = (datos) => {
    setAutenticadoState({ ...estadoInicialAutenticacion, ...datos, autenticado: true });
  };

  const login = async (username, password) => {
    setCargandoLogin(true); // Activa el spinner al iniciar la petición
    try {
      const respuesta = await axios.post("https://jwmalmcenb-production.up.railway.app/api/login", {
        username,
        password
      });
      const { token, id, personal_id, persona, username: userUsername, roles, accesos } = respuesta.data;

      const datosAutenticacion = {
        id,
        personal_id,
        persona,
        username: userUsername,
        token,
        roles,
        accesos
      };

      actualizarEstadoAutenticacion(datosAutenticacion);

      localStorage.setItem('usuario', JSON.stringify({ ...datosAutenticacion, autenticado: true }));

      setMensajeError('');

      if (toast.current) {
        toast.current.show({ severity: 'success', summary: 'Inicio de Sesión Exitoso', detail: 'Bienvenido', life: 3000 });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      let mensaje = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';

      if (error.response && error.response.data && error.response.data.error) {
        mensaje = error.response.data.error;
      } else if (error.request) {
        mensaje = 'No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.';
      } else {
        // Otro tipo de error
        mensaje = error.message;
      }

      setMensajeError(mensaje);
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Error de Inicio de Sesión', detail: mensaje, life: 5000 });
      }
    } finally {
      setCargandoLogin(false); // Desactiva el spinner al finalizar la petición (éxito o error)
    }
  };

  const logout = () => {
    setAutenticadoState(estadoInicialAutenticacion);
    localStorage.removeItem('usuario');
    console.log('Usuario removido de localStorage');
    if (toast.current) {
      toast.current.show({ severity: 'info', summary: 'Sesión Cerrada', detail: 'Has cerrado sesión correctamente.', life: 3000 });
    }
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const autenticadoDesdeStorage = usuarioGuardado ? JSON.parse(usuarioGuardado) : estadoInicialAutenticacion;
    setAutenticadoState(autenticadoDesdeStorage);
    console.log('Usuario cargado desde localStorage:', autenticadoDesdeStorage);
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
    mensajeError, // Exponemos el estado del mensaje de error
    obtenerToken
  };

  return (
    <AuthContext.Provider value={provider}>
      <Toast ref={toast} />
      {cargandoLogin && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',gap:'20px' }}>
            <span style={{ marginLeft: '10px', color: 'white' }}>Enviando credenciales...</span>
            <ProgressSpinner
              style={{ width: '50px', height: '50px' }}
              strokeWidth="5"
              fill="rgba(0, 0, 0, 0.5)"
              animationDuration=".5s"
            />
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};