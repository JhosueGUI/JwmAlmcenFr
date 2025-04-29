import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { deletePersonal } from "../Services/PersonalApi";

const UseDeletePersonal = () => {
    const { obtenerToken } = useContext(AuthContext);
    const Delete = async (id) => {
        try {
            const token = obtenerToken()
            const response = await deletePersonal(token, id)
            return response
        } catch (error) {
            console.log('Error', error)
        }
    }
    return { Delete }
}
export default UseDeletePersonal;