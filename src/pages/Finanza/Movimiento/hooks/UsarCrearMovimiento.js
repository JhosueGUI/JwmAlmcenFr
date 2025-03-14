// import { crearMovimiento } from "../service/ApiMovimiento";

import { useContext } from "react";
import { crearMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarCrearMovimiento = () => {
    const { obtenerToken } = useContext(AuthContext);
    const CrearMovimiento = async (data) => {
        try {
            const token = obtenerToken();
            const respuestaPost = await crearMovimiento(token, data);
            return respuestaPost;
        } catch (error) {
            console.error('Error al crear movimiento:', error);
        }
    }
    return { CrearMovimiento };
}
export default UsarCrearMovimiento;