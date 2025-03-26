import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getGrifo } from "../Services/SalidaCombustibleApi";

const UsarGetGrifo = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchGrifo = async () => {
            const token = obtenerToken();
            try {
                const respuesta = await getGrifo(token);
                setData(respuesta);
            } catch (error) {
                console.error("Error al obtener Grifo:", error);
            }
        }
        FetchGrifo();
    }, [])
    return { data, setData }
}
export default UsarGetGrifo;