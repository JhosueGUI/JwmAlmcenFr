import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { createSalida } from "../Services/SalidaApi";

const UseCreateProduct = () => {
    const { obtenerToken } = useContext(AuthContext);
    const Create = async (data) => {
        try {
            const token = obtenerToken();
            const response = await createSalida(token, data);
            return response;
        } catch (error) {
            console.error("Error al crear el producto:", error);
            throw error;
        }
    }
    return { Create };
}
export default UseCreateProduct;