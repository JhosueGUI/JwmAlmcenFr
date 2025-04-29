import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { getRoles } from "../../Services/ApiRol";

const UseGetRol = () => {
    const { obtenerToken } = useContext(AuthContext)
    const [rol, setRol] = useState([])
    useEffect(() => {
        const Fetch = async () => {
            try {
                const token = obtenerToken()
                const response=await getRoles(token)
                console.log('response', response)
                setRol(response)
            } catch (error) {
                console.log('Error', error)
            }
        }
        Fetch()
    }, [])
    return { rol,setRol }
}
export default UseGetRol;