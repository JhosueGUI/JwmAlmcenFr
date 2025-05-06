import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getUltimaSalida } from "../Services/SalidaApi";
import { useEffect } from "react";

const UseGetUltimaSalida = () => {
    const { obtenerToken } = useContext(AuthContext)
    const [ultimaSalida, setUltimaSalida] = useState([])
    useEffect(()=>{
        const Get = async () => {
            try {
                const token = obtenerToken()
                const response = await getUltimaSalida(token);
                setUltimaSalida(response)
            } catch (error) {
                console.log("Error al obtener la última salida:", error);
            }
        }
        Get()
    },[])
    return { ultimaSalida } 
}
export default UseGetUltimaSalida