import { useContext } from "react";
import { crearClienteMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarCreateCliente = () => {
    const { obtenerToken } = useContext(AuthContext)
    const CrearCliente = async (data) => {
        try {
            const token = obtenerToken();
            const response = await crearClienteMovimiento(token, data);
            return response;
        } catch (error) {
            console.error('Error al crear cliente:', error);
        }
    }
    return { CrearCliente }
}
export default UsarCreateCliente;