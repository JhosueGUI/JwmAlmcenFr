import { useContext } from "react"
import { AuthContext } from "../../../../context/AuthContext"
import { AsignAcces } from "../../Services/ApiAcces"

const UseAsignAcces = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Asing = async (data, id) => {
        try {
            const token = obtenerToken()
            const response = await AsignAcces(token, data, id)
            return response
        } catch (error) {
            console.log('Error', error)
        }
    }
    return { Asing }
}
export default UseAsignAcces