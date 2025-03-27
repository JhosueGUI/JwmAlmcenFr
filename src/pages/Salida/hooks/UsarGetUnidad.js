import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getUnidad } from "../Services/SalidaApi";

const UsarGetUnidad = () => {
    const [unidad, setUnidad] = useState([])
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchUnidad = async () => {
            const token = obtenerToken()
            const respuesta = await getUnidad(token)
            setUnidad(respuesta)
        }
        FetchUnidad()
    }, [])
    return { unidad }
}
export default UsarGetUnidad;