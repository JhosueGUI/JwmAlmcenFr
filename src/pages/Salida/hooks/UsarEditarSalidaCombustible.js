import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { EditarSalidaCombustible } from "../Services/SalidaCombustibleApi";

const UsarEditarSalidaCombustible = () => {
    const { obtenerToken } = useContext(AuthContext)

    const EditarSalida = async (data, id) => {
        try {
            const token = obtenerToken();
            const resp = await EditarSalidaCombustible(token, data, id);
            return resp;
        } catch (error) {
            console.error("Error al editar la salida de combustible:", error);
        }
    }
    return { EditarSalida };
}
export default UsarEditarSalidaCombustible;