import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getUnidad } from "../Services/ApiFormulario";

const UseGetUnidad = () => {
    const [unidad, setUnidad] = useState([]);
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchData = async () => {
            const token = obtenerToken();
            const response = await getUnidad(token);
            setUnidad(response);
        }
        FetchData();
    }, [])
    return { unidad, setUnidad };
}
export default UseGetUnidad;