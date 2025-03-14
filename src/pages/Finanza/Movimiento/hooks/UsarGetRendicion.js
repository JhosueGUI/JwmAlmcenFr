import { useContext, useEffect, useState } from "react";
import { getRendicionMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetRendicion = () => {

    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchRendicion = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await getRendicionMovimiento(token);
                const adaptarRespuesta = respuestaGet.map(rendicion => ({
                    rendicion_id: rendicion.id,
                    rendicion: rendicion.nombre_rendicion
                }))
                setData(adaptarRespuesta);
            } catch (error) {
                console.error('Error al obtener detalle:', error);
            }
        }
        FetchRendicion();
    }, [])
    return { data };
}
export default UsarGetRendicion;