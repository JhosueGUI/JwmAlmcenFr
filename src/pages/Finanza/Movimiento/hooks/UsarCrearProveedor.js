import { useContext } from "react"
import { AuthContext } from "../../../../context/AuthContext"
import { crearProveedor } from "../service/ApiMovimiento"

const UsarCrearProveedor = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Crear = async (data) => {
        try {
            const token = obtenerToken();
            const respuesta = await crearProveedor(token, data);
            return respuesta;
        } catch (error) {
            console.error("Error al crear el proveedor:", error);
        }
    }
    return { Crear }
}
export default UsarCrearProveedor