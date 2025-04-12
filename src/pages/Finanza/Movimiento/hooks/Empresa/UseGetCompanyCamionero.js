import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { getCompanyCamionero } from "../../service/ApiCompany";

const UseGetCompanyCamionero = () => {
    const [company, setCompany] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchData = async () => {
            try {
                const token = obtenerToken();
                const response = await getCompanyCamionero(token);
                setCompany(response);
            } catch (error) {
                console.error('Error al obtener empresa:', error);
            }
        }
        FetchData();
    }, [])
    return { company };
}
export default UseGetCompanyCamionero;