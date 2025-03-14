import axios from "axios";
import { useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const GetEstadoOperativo = ({pasarSetDataInventario}) => {
    //traer al token
    const { obtenerToken } = useContext(AuthContext);
    //#region Estados para la unidad de Medida
    const [EstadoOperativo, setEstadoOperativo] = useState([]);
    const [EstadoOperativoSeleccionado, SetEstadoOperativoSeleccionado] = useState(null);

    //#region Obtención de UnidadMedida
    useEffect(() => {
        const ObtenerEstadoOperativo = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    const respuesta = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/estado_operativo/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setEstadoOperativo(respuesta.data.data);
                } else {
                    console.log("No se encontró un token de autenticación válido");
                }
            } catch (error) {
                console.error("Error al obtener estado operativo:", error);
            }
        };
        ObtenerEstadoOperativo();
    }, []);
    //#endregion
    const ControlarOpcionEstado = (event) => {
        const EstadoOperativoSeleccionado = event.value;
        SetEstadoOperativoSeleccionado(EstadoOperativoSeleccionado);
        pasarSetDataInventario({
            ...EstadoOperativoSeleccionado,
            estado_operativo_id: EstadoOperativoSeleccionado.id
        });
    };
    return (
        <div style={{ width: '100%', margin: '0 auto'}}>
            <FloatLabel>
                <Dropdown
                    id="estado_operativo"
                    value={EstadoOperativoSeleccionado}
                    options={EstadoOperativo}
                    onChange={ControlarOpcionEstado}
                    optionLabel="nombre" // Asegúrate de que el campo 'nombre' exista en los datos de la unidad de medida
                    placeholder="Seleccione un Estado Operativo"
                    style={{ width: '100%' }}
                    filter
                    filterBy="nombre" // Asegúrate de que el campo 'nombre' exista en los datos de la unidad de medida
                    showClear
                />
                <label htmlFor="estado_operativo">Seleccione un Estado Operativo</label>
            </FloatLabel>
        </div>
    );
};

export default GetEstadoOperativo;
