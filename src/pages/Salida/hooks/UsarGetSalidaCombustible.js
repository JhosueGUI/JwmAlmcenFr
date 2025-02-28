import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getSalidaCombustible } from "../Services/SalidaCombustibleApi";

const UsarGetSalidaCombustible = () => {
    const [data, setData] = useState([])
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchSalida = async () => {
            try {
                const token = obtenerToken();
                const data = await getSalidaCombustible(token);
                setData(data);
            } catch (error) {
                console.error("Error al obtener Salida Combustible:", error);
            }
        }
        FetchSalida();
    })
    return { data, setData }
}
export default UsarGetSalidaCombustible;