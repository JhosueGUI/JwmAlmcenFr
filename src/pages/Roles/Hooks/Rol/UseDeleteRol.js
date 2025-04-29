import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { deleteRol } from "../../Services/ApiRol";

const UseDeleteRol = () => {
    const { obtenerToken } = useContext(AuthContext);
    const Delete = async (id) => {
        try {
            const token = obtenerToken()
            const response = await deleteRol(token, id)
            return response
        } catch (error) {
            console.log('Error', error)
        }
    }
    return { Delete }
}
export default UseDeleteRol;