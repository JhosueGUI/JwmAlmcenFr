import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { crearPersona } from "../service/ApiMovimiento";

const UsarCrearPersona = () => {
    const { obtenerToken } = useContext(AuthContext);
    const Crear = async (data) => {
        try {
            const token = obtenerToken();
            const respuesta = await crearPersona(token, data);
            return respuesta;
        } catch (error) {
            console.error('Error al crear persona:', error);
        }
    }
    return { Crear }
}
export default UsarCrearPersona;