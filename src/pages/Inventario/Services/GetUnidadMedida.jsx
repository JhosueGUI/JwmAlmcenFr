import axios from "axios";
import { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const GetUnidadMedida = ({ pasarSetDataInventario, pasarUnidadMedidaSeleccionado }) => {
    //obtener token
    const { obtenerToken } = useContext(AuthContext)
    //#region Estados para la unidad de Medida
    const [unidadMedida, setUnidadMedida] = useState([]);
    const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState(null);

    //#region Obtención de UnidadMedida
    useEffect(() => {
        const obtenerUnidadMedida = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    const respuesta = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/unidad_medida/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const UnidadMedidaActual = respuesta.data.data
                    setUnidadMedida(UnidadMedidaActual);
                    if (pasarUnidadMedidaSeleccionado) {
                        const rellenarUnidadMedidaSeleccionado = UnidadMedidaActual.find(um => um.id === pasarUnidadMedidaSeleccionado.unidad_medida_id)
                        if (rellenarUnidadMedidaSeleccionado) {
                            setUnidadMedidaSeleccionada(rellenarUnidadMedidaSeleccionado);
                        }
                    }
                } else {
                    console.log("No se encontró un token de autenticación válido");
                }
            } catch (error) {
                console.error("Error al obtener Unidad de Medida:", error);
            }
        };
        obtenerUnidadMedida();
    }, [pasarUnidadMedidaSeleccionado]);
    //#endregion
    const ControlarOpcionUnidadMedida = (event) => {
        const unidadMedidaSeleccionada = event.value;
        setUnidadMedidaSeleccionada(unidadMedidaSeleccionada);
        pasarSetDataInventario({
            ...unidadMedidaSeleccionada,
            unidad_medida_id: unidadMedidaSeleccionada.id
        });
    };
    return (
        <div style={{ width: '100%', margin: '0 auto' }}>
            <FloatLabel>
                <Dropdown
                    id="unidadMedida"
                    value={unidadMedidaSeleccionada}
                    options={unidadMedida}
                    onChange={ControlarOpcionUnidadMedida}
                    optionLabel="nombre" // Asegúrate de que el campo 'nombre' exista en los datos de la unidad de medida
                    placeholder="Seleccione una unidad de medida"
                    style={{ width: '100%' }}
                    filter
                    filterBy="nombre" // Asegúrate de que el campo 'nombre' exista en los datos de la unidad de medida
                    showClear
                />
                <label htmlFor="unidadMedida">Seleccione una unidad de medida</label>
            </FloatLabel>
        </div>
    );
};

export default GetUnidadMedida;
