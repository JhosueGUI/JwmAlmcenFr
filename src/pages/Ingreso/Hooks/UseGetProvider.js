import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getProvider } from "../Services/IngresoApi";

const UseGetProvider = () => {
    const [data, setData] = useState([])
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchProvider = async () => {
            try {
                const token = obtenerToken();
                const response = await getProvider(token);
                setData(response);
            } catch (error) {
                console.error("Error al obtener proveedor:", error);
            }
        }
        FetchProvider()
    }, [])
    return { data };
}
export default UseGetProvider;