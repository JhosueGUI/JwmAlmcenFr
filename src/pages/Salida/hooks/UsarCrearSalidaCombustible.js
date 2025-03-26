import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { createSalidaCombustible } from "../Services/SalidaCombustibleApi";

const UsarCrearSalidaCombustible = () => {
    const { obtenerToken } = useContext(AuthContext);
    
    const Crear = async (data) => {
        try {
            const token = obtenerToken();
            const respuesta = await createSalidaCombustible(token, data);
            return respuesta;
        } catch (error) {
            console.error("Error al crear Salida Combustible:", error);
            throw error;
        }
    }
    return { Crear }
}
export default UsarCrearSalidaCombustible;