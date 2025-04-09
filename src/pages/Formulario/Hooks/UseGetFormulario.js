import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getFormulario } from "../Services/ApiFormulario";

const UseGetFormulario = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchData = async () => {
            try {
                const token = obtenerToken();
                const response = await getFormulario(token);
                setData(response);
            } catch (error) {
                console.error('Error al obtener formulario:', error);
            }
        }
        FetchData();
    }, [])
    return { data, setData };
}
export default UseGetFormulario;