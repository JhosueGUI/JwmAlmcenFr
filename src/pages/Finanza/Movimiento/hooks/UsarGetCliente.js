import { useContext, useEffect, useState } from "react"
import { getClienteMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetCliente = () => {
    const [data, setData] = useState([]);
    const {obtenerToken}=useContext(AuthContext);

    useEffect(() => {
        const FetchProveedor = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await getClienteMovimiento(token);
                setData(respuestaGet);
            } catch (error) {
                console.error('Error al obtener proveedor:', error);
            }
        }
        FetchProveedor();
    }, [])
    return { data, setData };
}
export default UsarGetCliente;
