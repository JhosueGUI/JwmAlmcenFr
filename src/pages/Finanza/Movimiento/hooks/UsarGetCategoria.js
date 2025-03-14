import { useContext, useEffect, useState } from "react"
import { getCategoriaMovimiento } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetCategoria = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchCategoria = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await getCategoriaMovimiento(token);
                setData(respuestaGet);
            } catch (error) {
                console.error('Error al obtener categoria:', error);
            }
        }
        FetchCategoria();
    }, [])
    return { data }
}
export default UsarGetCategoria;