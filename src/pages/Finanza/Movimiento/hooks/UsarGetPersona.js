import { useContext, useEffect, useState } from "react";
import { getPersona } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetPersona = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchPersona = async () => {
            try {
                const token = obtenerToken();
                const respuesta = await getPersona(token);
                setData(respuesta);
            } catch (error) {
                console.error('Error al obtener persona:', error);
            }
        }
        FetchPersona();
    }, [])
    return { data,setData }
}
export default UsarGetPersona;