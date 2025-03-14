import { useContext } from "react";
import { editarMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarEditarMovimiento = () => {
    const { obtenerToken } = useContext(AuthContext)
    const EditarMovimiento = async (data, id) => {
        try {
            const token = obtenerToken();
            const response = await editarMovimiento(token, data, id);
            return response;
        } catch (error) {
            console.error('Error al editar movimiento:', error);
        }
    }
    return { EditarMovimiento };
}
export default UsarEditarMovimiento;