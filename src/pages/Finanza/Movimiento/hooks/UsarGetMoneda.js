import { useContext, useEffect, useState } from "react";
import { getMonedaMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetMoneda = () => {
    const {obtenerToken}=useContext(AuthContext)
    const [data, setData] = useState([]);
    useEffect(() => {
        const FetchMoneda = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await getMonedaMovimiento(token);
                setData(respuestaGet);
            } catch (error) {
                console.error('Error al obtener moneda:', error);
            }
        }
        FetchMoneda();
    }, [])
    return {data}
}
export default UsarGetMoneda;