import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetPersonal } from "../Services/PersonalApi";

const UsarGetPersonal = () => {
    const [data, setData] = useState([]);
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchPersonal = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await GetPersonal(token);
                setData(respuestaGet);
            } catch (error) {
                console.error("Error al obtener Personal:", error);
                throw error;
            }
        }
        FetchPersonal();
    }, [])
    return { data,setData };
}
export default UsarGetPersonal;