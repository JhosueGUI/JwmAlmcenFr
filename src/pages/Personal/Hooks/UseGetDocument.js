import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { getDocument } from "../Services/DocumentoApi"

const UseGetDocument = () => {
    const { obtenerToken } = useContext(AuthContext)
    const [documento, setDocumento] = useState([])
    
    useEffect(() => {
        const Fetch = async () => {
            try {
                const token = obtenerToken();
                const response = getDocument(token)
                setDocumento(response)
            } catch (error) {
                console.error("Error al obtener el documento:", error);
            }
        }
        Fetch()
    }, [])
    return { documento }
}
export default UseGetDocument