import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { getCompanyFSJ } from "../../service/ApiCompany";

const UseGetCompanyFSJ = () => {
    const [company, setCompany] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchData = async () => {
            try {
                const token = obtenerToken();
                const response = await getCompanyFSJ(token);
                setCompany(response);
            } catch (error) {
                console.error('Error al obtener empresa:', error);
            }
        }
        FetchData();
    }, [])
    return { company };
}
export default UseGetCompanyFSJ;