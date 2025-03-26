import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { createGrifo } from "../Services/SalidaCombustibleApi";

const UsarCrearGrifo = () => {
    const { obtenerToken } = useContext(AuthContext);
    const Crear = async (data) => {
        const token = obtenerToken();
        try {
            const respuesta = await createGrifo(token, data);
            return respuesta;
        } catch (error) {
            console.error("Error al crear Grifo:", error);
        }
    }
    return { Crear }
}
export default UsarCrearGrifo;