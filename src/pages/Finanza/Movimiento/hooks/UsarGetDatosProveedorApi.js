import { useContext } from "react";
import { getDatosProveedorApi } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetDatosProveedorApi = () => {
    const { obtenerToken } = useContext(AuthContext)
    const fetchDatosProveedor = async (ruc) => {
        try {
            const token = obtenerToken();
            const respuestaGet = await getDatosProveedorApi(token, ruc);
            return respuestaGet
        } catch (error) {
            console.error('Error al obtener datos del proveedor:', error);
        }
    }
    return { fetchDatosProveedor }
}
export default UsarGetDatosProveedorApi;