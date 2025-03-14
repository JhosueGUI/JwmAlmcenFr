import { useContext } from "react";
import { crearTrazabilidad } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarCrearTrazabilidad = () => {
    const { obtenerToken } = useContext(AuthContext);
    const CrearTrazabilidad = async (data, id) => {
        try {
            const token = obtenerToken()
            const response = await crearTrazabilidad(token, data, id);
            return response;
        } catch (error) {
            console.error('Error al crear trazabilidad:', error);
        }
    }
    return { CrearTrazabilidad };
}
export default UsarCrearTrazabilidad;