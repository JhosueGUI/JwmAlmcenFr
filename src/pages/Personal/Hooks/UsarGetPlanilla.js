import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { GetPlanilla } from "../Services/PersonalApi"

const UsarGetPlanilla = () => {
    const [data, setData] = useState([])
    const { obtenerToken } = useContext(AuthContext)

    useEffect(() => {
        const FetchPlanilla = async () => {
            try {
                const token = obtenerToken()
                const respuesta = await GetPlanilla(token)
                setData(respuesta)
            } catch (error) {
                console.error("Error al obtener Planilla:", error)
                throw error
            }
        }
        FetchPlanilla()
    }, [])
    return { data, setData }
}
export default UsarGetPlanilla