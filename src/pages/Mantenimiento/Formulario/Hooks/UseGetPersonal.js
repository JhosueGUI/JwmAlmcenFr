import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { getPersonal } from "../Services/ApiFormulario";

const UseGetPersonal = () => {
    const [personal, setPersonal] = useState([]);
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchData = async () => {
            const token = obtenerToken()
            const response = await getPersonal(token)
            setPersonal(response)
        }
        FetchData()
    }, [])
    return { personal, setPersonal }
}
export default UseGetPersonal