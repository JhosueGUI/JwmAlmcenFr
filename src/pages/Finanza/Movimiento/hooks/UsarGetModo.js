import { useContext, useEffect, useState } from "react";
import { getModoMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetModo = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchModo = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await getModoMovimiento(token);
                setData(respuestaGet);
            } catch (error) {
                console.error('Error al obtener modo:', error);
            }
        }
        FetchModo();
    }, [])
    return { data };
}
export default UsarGetModo;