import axios from "axios";
import { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const GetUbicacion = ({ pasarSetDataInventario, pasarUbicacionSeleccionado }) => {
    //obtener el token
    const { obtenerToken } = useContext(AuthContext)
    const [ubicacion, setUbicacion] = useState([]);
    const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);

    useEffect(() => {
        const obtenerUbicacion = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuesta = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/ubicacion/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const UbicacionActual = respuesta.data.data
                    setUbicacion(UbicacionActual);
                    if (pasarUbicacionSeleccionado) {
                        const rellenarUbicacionSeleccionado = UbicacionActual.find(u => u.id === pasarUbicacionSeleccionado.ubicacion_id)
                        if (rellenarUbicacionSeleccionado) {
                            setUbicacionSeleccionada(rellenarUbicacionSeleccionado)
                        }
                    }
                } else {
                    console.log("No se encontró un token de autenticación válido");
                }
            } catch (error) {
                console.error("Error al obtener ubicaciones:", error);
            }
        };
        obtenerUbicacion();
    }, [pasarUbicacionSeleccionado]);

    const handleUbicacionChange = (event) => {
        const ubicacionSeleccionada = event.value;
        setUbicacionSeleccionada(ubicacionSeleccionada);
        pasarSetDataInventario({
            ...ubicacionSeleccionada,
            ubicacion_id: ubicacionSeleccionada.id
        });
    };

    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <FloatLabel>
                <Dropdown
                    id="ubicacion"
                    value={ubicacionSeleccionada}
                    options={ubicacion}
                    onChange={handleUbicacionChange}
                    optionLabel="codigo_ubicacion"
                    placeholder="Seleccione una Ubicación"
                    style={{ width: '100%' }}
                    filter
                    filterBy="codigo_ubicacion"
                    showClear
                />
                <label htmlFor="ubicacion">Seleccione una Ubicación</label>
            </FloatLabel>
        </div>
    );
};

export default GetUbicacion;
