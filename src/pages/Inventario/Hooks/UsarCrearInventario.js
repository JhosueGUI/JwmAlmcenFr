import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { CrearInventario } from "../Services/InventarioApi";

const UsarCrearInventario = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Crear = async (data) => {
        try {
            const token = obtenerToken();
            const resuesta = CrearInventario(token, data);
            return resuesta;
        } catch (error) {
            console.error("Error al crear el inventario:", error);
        }
    }
    return { Crear };
}
export default UsarCrearInventario;