import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getFlota } from "../Services/SalidaCombustibleApi";

const UseGetFlota = () => {
    const { obtenerToken } = useContext(AuthContext);
    const [flota, setFlota] = useState([]);
    useEffect(() => {
        const Fetch = async () => {
            try {
                const token = obtenerToken();
                const response = await getFlota(token);
                setFlota(response)
            } catch (error) {
                console.error("Error al obtener flota:", error);
            }
        }
        Fetch()
    }, [])
    return { flota }
}
export default UseGetFlota;