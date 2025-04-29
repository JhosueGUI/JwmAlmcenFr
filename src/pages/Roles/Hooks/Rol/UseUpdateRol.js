import { useContext } from "react"
import { AuthContext } from "../../../../context/AuthContext"
import { updateRol } from "../../Services/ApiRol"

const UseUpdateRol = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Update = async (data,id) => {
        try {
            const token = obtenerToken()
            const response = await updateRol(token, data, id)
            return response
        } catch (error) {
            console.log('Error', error)
        }
    }
    return { Update }
}
export default UseUpdateRol