import { useEffect, useState, useContext } from "react";
import { GetStockCombustible } from "../Services/SalidaCombustibleApi";
import { AuthContext } from "../../../context/AuthContext";

const UsarGetStockCombustible = () => {
    const [respuesta, setRespuesta] = useState([]);
    const { obtenerToken } = useContext(AuthContext);

    useEffect(() => {
        const FetchData = async () => {
            try {
                const token = obtenerToken();
                console.log("Token:", token);
                const data = await GetStockCombustible(token);
                console.log("Respuesta de API:", data);
                setRespuesta(data);
            } catch (error) {
                console.error("Error al obtener Combustible:", error);
            }
        };

        FetchData();
    }, []);

    return { respuesta };
};

export default UsarGetStockCombustible;
