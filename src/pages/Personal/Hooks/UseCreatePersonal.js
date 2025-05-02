import { useContext } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { createPersonal } from "../Services/PersonalApi"

const UseCreatePersonal = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Create = async (data) => {
        try {
            const token = obtenerToken();
            const response = await createPersonal(token, data)
            return response
        } catch (error) {
            console.error("Error al crear Personal:", error);
            throw error;
        }
    }
    return { Create }
}
export default UseCreatePersonal