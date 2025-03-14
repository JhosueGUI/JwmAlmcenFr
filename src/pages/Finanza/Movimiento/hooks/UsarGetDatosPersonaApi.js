
import { useContext } from "react";
import { getDatosPersonaApi } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetDatosPersonaApi = () => {
    const { obtenerToken } = useContext(AuthContext);
    const FetchDatosPersona = async (dni) => {
        try {
            const token = obtenerToken();
            const respuestaGet = await getDatosPersonaApi(token, dni);
            return respuestaGet;
        } catch (error) {
            console.error('Error al obtener datos de la persona:', error);
        }
    }
    return { FetchDatosPersona }
}
export default UsarGetDatosPersonaApi;