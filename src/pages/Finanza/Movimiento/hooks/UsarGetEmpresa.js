import { useContext, useEffect, useState } from "react";
import { getEmpresaMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetEmpresa = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchEmpresa = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await getEmpresaMovimiento(token);
                setData(respuestaGet);
            } catch (error) {
                console.error('Error al obtener estado:', error);
            }
        }
        FetchEmpresa();
    }, [])
    return { data };
}
export default UsarGetEmpresa;