import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { updateSalida } from "../Services/SalidaApi";

const UseUpdateSalida = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Update = async (data, id) => {
        try {
            const token = obtenerToken();
            const response = await updateSalida(token, data, id)
            return response;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }
    return { Update };
}
export default UseUpdateSalida;