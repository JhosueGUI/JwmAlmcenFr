import { useContext } from "react";
import { createFormulario } from "../Services/ApiFormulario";
import { AuthContext } from "../../../../context/AuthContext";

const UseCreateFormulario = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Create = async (data) => {
        try {
            const token = obtenerToken()
            const response = await createFormulario(token, data);
            return response;
        } catch (error) {
            console.error('Error al crear formulario:', error);
        }
    }
    return { Create };
}
export default UseCreateFormulario;