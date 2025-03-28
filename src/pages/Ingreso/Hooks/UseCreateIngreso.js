import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { createIngreso } from "../Services/IngresoApi";

const UseCreateIngreso = () => {
    const { obtenerToken } = useContext(AuthContext);
    const Create = async (data) => {
        try {
            const token = obtenerToken();
            const response = await createIngreso(token, data);
            return response;
        } catch (error) {
            console.error("Error al crear ingreso:", error);
            throw error;
        }
    }
    return { Create };
}
export default UseCreateIngreso;