import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getPersonal } from "../Services/SalidaApi";

const UsarGetPersonal = () => {
    const [personal, setPersonal] = useState([])
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchPersonal = async () => {
            const token = obtenerToken()
            const respuesta = await getPersonal(token)
            setPersonal(respuesta)
        }
        FetchPersonal()
    }, [])
    return { personal }
}
export default UsarGetPersonal;