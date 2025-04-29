import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { reactivatePersonal } from "../Services/PersonalApi";

const UseReactivePersonal = () => {
    const { obtenerToken } = useContext(AuthContext)
    const Reactivate = async (id) => {
        try{
            const token = obtenerToken()
            const response = await reactivatePersonal(token, id)
            return response
        }catch(error){
            console.log('Error', error)
        }
    }
    return { Reactivate }
}
export default UseReactivePersonal;