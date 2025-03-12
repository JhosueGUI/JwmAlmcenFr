import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { EditarInventario } from "../Services/InventarioApi";

const UsarEditarInventario = () => {
    const { obtenerToken } = useContext(AuthContext);
    const Editar = async (data, id) => {
        try {
            const token = obtenerToken();
            const respuesta = await EditarInventario(token, data, id);
            return respuesta;
        } catch (error) {
            console.error("Error al editar el inventario:", error);
        }
    }
    return { Editar };
}
export default UsarEditarInventario;