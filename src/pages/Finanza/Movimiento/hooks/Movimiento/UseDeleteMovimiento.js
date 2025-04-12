import { useContext } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { deleteMovimiento } from "../../service/ApiMovimiento";

const UseDeleteMovimiento = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Delete = async (id) => {
        try {
            const token = await obtenerToken()
            const response = await deleteMovimiento(token, id);
            return response;
        }
        catch (error) {
            console.error("Error al eliminar el movimiento:", error);
        }
    }
    return { Delete }
}
export default UseDeleteMovimiento;