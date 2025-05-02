import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { editPersonal } from "../Services/PersonalApi";

const UseEditPersonal=()=>{
    const {obtenerToken}=useContext(AuthContext)
    const Edit=async(id,data)=>{
        try{
            const token=obtenerToken()
            const response = await editPersonal(token,id,data)
            return response
        }catch(error){
            console.error("Error al editar Personal:", error);
        }
    }
    return {Edit}
}
export default UseEditPersonal;