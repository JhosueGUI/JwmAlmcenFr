import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { ca } from "date-fns/locale";
import { getProveedor } from "../service/ApiMovimiento";

const UsarGetProveedor = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchProveedor = async () => {
            try {
                const token = obtenerToken();
                const respuesta = await getProveedor(token);
                setData(respuesta);
            } catch (error) {
                console.error('Error al obtener proveedor:', error);
            }
        }
        FetchProveedor();
    }, [])
    return { data, setData }
}
export default UsarGetProveedor;