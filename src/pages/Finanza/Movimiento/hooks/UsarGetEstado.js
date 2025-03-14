import { useContext, useEffect, useState } from "react";
import { getEstadoMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetEstado = () => {
    const [data, setData] = useState([]);
    const {obtenerToken}=useContext(AuthContext);
    useEffect(() => {
        const FetchMovimiento = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await getEstadoMovimiento(token);
                const adaptarRespuesta = respuestaGet.map(estado => ({
                    estado_id: estado.id,
                    estado_nombre: estado.nombre_estado_comprobante
                }))
                setData(adaptarRespuesta);
            } catch (error) {
                console.error('Error al obtener estado:', error);
            }
        }
        FetchMovimiento();
    }, [])
    return { data };
}
export default UsarGetEstado;