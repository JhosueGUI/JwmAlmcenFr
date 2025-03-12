import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetCargo } from "../Services/PersonalApi";

const UsarGetCargo = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchCargo = async () => {
            try {
                const token = obtenerToken();
                const respuesta = await GetCargo(token);
                setData(respuesta);
            } catch (error) {
                console.error("Error al obtener Cargo:", error);
                throw error;
            }
        }
        FetchCargo();
    }, [])
    return { data, setData };
}
export default UsarGetCargo;