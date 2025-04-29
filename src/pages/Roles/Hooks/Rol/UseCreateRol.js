import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { createRol } from "../../Services/ApiRol";

const UseCreateRol = () => {
    const { obtenerToken } = useContext(AuthContext);
    const Create = async (rolData) => {
        try {
            const token = obtenerToken();
            const response = await createRol(token, rolData);
            return response;
        } catch (error) {
            console.log('Error', error)
        }
    }
    return { Create };
}
export default UseCreateRol;