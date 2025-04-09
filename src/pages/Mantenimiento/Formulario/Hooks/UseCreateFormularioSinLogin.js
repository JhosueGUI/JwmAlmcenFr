import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { createFormularioSinLogin } from "../Services/ApiFormulario";

const UseCreateFormularioSinLogin = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Create = async (data) => {
        try {
            const token = obtenerToken()
            const response = await createFormularioSinLogin(token, data);
            return response;
        } catch (error) {
            console.error('Error al crear formulario:', error);
        }
    }
    return { Create };
}
export default UseCreateFormularioSinLogin;