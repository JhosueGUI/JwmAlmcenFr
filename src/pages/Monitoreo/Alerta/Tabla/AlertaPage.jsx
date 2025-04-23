import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BsFuelPumpFill, BsBellFill } from "react-icons/bs";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const credentials = {
  "provider": "thirdparty",
  "username": "iQSTqQm2vsX5gWF",
  "password": "3z1AGs34iyF1MFWxC9Vm5BDlO4X9"
};

let authToken = null;
let refreshTokenPromise = null;

const getAuthToken = async () => {
  try {
    const response = await axios.post('https://v2api.frotcom.com/v2/authorize', credentials);
    authToken = response.data.token;
    console.log("Token obtenido:", authToken);
    // Aquí podrías guardar el token en localStorage si lo deseas
    return authToken;
  } catch (error) {
    console.error("Error al obtener el token:", error);
    throw error; // Propaga el error para que el componente lo maneje
  }
};

const refreshToken = async () => {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post('https://v2api.frotcom.com/v2/authorize', credentials);
      authToken = response.data.token;
      console.log("Token refrescado:", authToken);
      // Aquí podrías actualizar el token en localStorage si lo guardaste allí
      resolve(authToken);
    } catch (error) {
      console.error("Error al refrescar el token:", error);
      // Aquí podrías limpiar el token almacenado y forzar un nuevo inicio de sesión
      authToken = null;
      reject(error);
    } finally {
      refreshTokenPromise = null;
    }
  });

  return refreshTokenPromise;
};

// Interceptor para añadir el token a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    if (authToken && config.url !== 'https://v2api.frotcom.com/v2/authorize') {
      config.params = { ...config.params, api_key: authToken };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación (401)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== 'https://v2api.frotcom.com/v2/authorize') {
      originalRequest._retry = true;
      console.log("Intento de refrescar el token...");
      try {
        const newToken = await refreshToken();
        originalRequest.params = { ...originalRequest.params, api_key: newToken };
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Error al refrescar el token:", refreshError);
        // Aquí podrías redirigir al usuario a la página de inicio de sesión o mostrar un error
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export function AlertaPage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [consumo, setConsumo] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL_VEHICLES = `https://v2api.frotcom.com/v2/vehicles?includeSensors=true`;
  const API_URL_FUEL = `https://v2api.frotcom.com/v2/vehicles/{vehicleId}/fuel`;
  const API_URL_ALERTS = `https://v2api.frotcom.com/v2/alarms/occurrences`;
  const API_URL_CONSUMO = `https://v2api.frotcom.com/v2/vehicles/307979/graphs`;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (!authToken) {
          await getAuthToken();
        }
        await fetchVehiculos();
        await fetchAlertas();
        await FetchConsumo();
      } catch (error) {
        console.error("Error inicial al obtener datos:", error);
        // Manejar el error inicial (por ejemplo, mostrar un mensaje al usuario)
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    const interval = setInterval(async () => {
      if (authToken) {
        await fetchVehiculos();
        await fetchAlertas();
        await FetchConsumo();
      }
    }, 300000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const fetchVehiculos = async () => {
    try {
      const response = await axios.get(API_URL_VEHICLES);
      setVehiculos(
        await Promise.all(
          response.data.map(async (vehiculo) => {
            try {
              const fuelApiUrl = API_URL_FUEL.replace('{vehicleId}', vehiculo.id);
              const responseFuel = await axios.get(fuelApiUrl);
              if (responseFuel.data && responseFuel.data.length > 0) {
                const registrosOrdenados = responseFuel.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                vehiculo.fuelLevel = registrosOrdenados[0]?.levelPerc ?? null;
              } else {
                vehiculo.fuelLevel = null;
              }
            } catch (error) {
              console.error(`Error al obtener combustible para ${vehiculo.id}:`, error);
              vehiculo.fuelLevel = null;
            }
            vehiculo.direccion = "Dirección no disponible";
            vehiculo.ciudad = "Ciudad no disponible";
            vehiculo.distrito = "Distrito no disponible";
            return vehiculo;
          })
        )
      );
    } catch (error) {
      console.error("Error al obtener vehículos:", error);
    }
  };

  const fetchAlertas = async () => {
    try {
      const responseAlertas = await axios.post(API_URL_ALERTS, { severity: "CRITICAL" });
      setAlertas(responseAlertas.data.occurrences || []);
    } catch (error) {
      console.error("Error al obtener alertas:", error);
    }
  };

  const FetchConsumo = async () => {
    try {
      const response = await axios.get(API_URL_CONSUMO);
      setConsumo(response.data.fuel?.[0]?.totals?.avgConsumptionPerHour ?? null);
    } catch (error) {
      console.error("Error al obtener consumo:", error);
    }
  };

  const placaTemplate = (rowData) => <span>{rowData.licensePlate}</span>;

  const estadoTemplate = (rowData) => (
    <span
      style={{
        backgroundColor: rowData.speed > 0 ? "rgb(191, 241, 223)" : "rgb(255, 236, 236)",
        color: rowData.speed > 0 ? "green" : "red",
        padding: "4px 8px",
        borderRadius: "4px",
        display: "inline-block"
      }}
    >
      {rowData.speed > 0 ? "En ruta" : "Parado"}
    </span>
  );

  const rowClassName = (rowData) => (rowData.speed > 0 ? 'fila-en-ruta' : 'fila-parado');

  const combustibleTemplate = (rowData) => {
    if (rowData.fuelLevel === null) {
      return <span></span>;
    }
    let color = 'green';
    let fuelText = '';
    if (rowData.fuelLevel < 20) {
      color = 'red';
      fuelText = `${rowData.fuelLevel}%`;
    } else if (rowData.fuelLevel < 50) {
      color = 'yellow';
      fuelText = `${rowData.fuelLevel}%`;
    } else {
      fuelText = `${rowData.fuelLevel}%`;
    }

    return (
      <span>
        <div className="" style={{ gap: '8px', display: 'flex', alignItems: 'center' }}>
          <div className="circulo" style={{ backgroundColor: color, width: '20px', height: '20px', borderRadius: '50%', display: 'inline-block' }}>
            <BsFuelPumpFill style={{ color: 'white', fontSize: '12px', marginLeft: '4px', marginTop: '4px' }} />
          </div>
          {fuelText}
        </div>
      </span>
    );
  };

  const obtenerUltimasAlertasPorSeveridad = (rowData) => {
    const alertasVehiculo = alertas.filter(alerta => alerta.licensePlate === rowData.licensePlate);
    const alertasPorSeveridad = alertasVehiculo.reduce((acc, alerta) => {
      if (!acc[alerta.severityName]) {
        acc[alerta.severityName] = [];
      }
      acc[alerta.severityName].push(alerta);
      return acc;
    }, {});

    const ultimaAlertaPorSeveridad = {};
    for (const severidad in alertasPorSeveridad) {
      alertasPorSeveridad[severidad].sort((a, b) => new Date(b.started) - new Date(a.started));
      ultimaAlertaPorSeveridad[severidad] = alertasPorSeveridad[severidad][0]?.definitionName || '';
    }
    return ultimaAlertaPorSeveridad;
  };

  const alertaLeveTemplate = (rowData) => {
    const ultimasAlertas = obtenerUltimasAlertasPorSeveridad(rowData);
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: ultimasAlertas.Leve ? 'orange' : 'green' }}>
        {ultimasAlertas.Leve ? <BsBellFill style={{ marginRight: '5px' }} /> : <BsBellFill style={{ marginRight: '5px', color: 'lightgray' }} />}
        {ultimasAlertas.Leve || 'Sin alertas'}
      </div>
    );
  };

  const alertaCriticoTemplate = (rowData) => {
    const ultimasAlertas = obtenerUltimasAlertasPorSeveridad(rowData);
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: ultimasAlertas.Critico ? 'red' : 'green' }}>
        {ultimasAlertas.Critico ? <BsBellFill style={{ marginRight: '5px' }} /> : <BsBellFill style={{ marginRight: '5px', color: 'lightgray' }} />}
        {ultimasAlertas.Critico || 'Sin alertas'}
      </div>
    );
  };

  const alertaSeveroTemplate = (rowData) => {
    const ultimasAlertas = obtenerUltimasAlertasPorSeveridad(rowData);
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: ultimasAlertas.Severo ? 'darkorange' : 'green' }}>
        {ultimasAlertas.Severo ? <BsBellFill style={{ marginRight: '5px' }} /> : <BsBellFill style={{ marginRight: '5px', color: 'lightgray' }} />}
        {ultimasAlertas.Severo || 'Sin alertas'}
      </div>
    );
  };

  return (
    <div className="p-4">
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <DataTable
          value={vehiculos}
          loading={loading}
          rowClassName={rowClassName}
          responsiveLayout="scroll"
        >
          <Column field="licensePlate" header="Unidad" body={placaTemplate} />
          <Column field="driverName" header="Conductor" />
          <Column field="speed" header="KM / H" />
          <Column header="Estado" body={estadoTemplate} />
          <Column header="Combustible (%)" body={combustibleTemplate} />
          <Column header="Consumo por Hora" body={() => consumo !== null ? consumo.toFixed(2) : ''} />
          <Column header="Alerta Leve" body={alertaLeveTemplate} />
          <Column header="Alerta Crítica" body={alertaCriticoTemplate} />
          <Column header="Alerta Severa" body={alertaSeveroTemplate} />
        </DataTable>
      )}
    </div>
  );
}