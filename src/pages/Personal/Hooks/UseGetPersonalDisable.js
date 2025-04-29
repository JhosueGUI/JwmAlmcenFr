import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getPersonalDisable } from "../Services/PersonalApi";

const UseGetPersonalDisable = () => {
    const { obtenerToken } = useContext(AuthContext)
    const [personalDisable, setPersonalDisable] = useState([])
    useEffect(() => {
        const FetchDisable = async () => {
            try {
                const token = obtenerToken()
                const response = await getPersonalDisable(token)
                setPersonalDisable(response)
            } catch (error) {
                console.log('Error', error)
            }
        }
        FetchDisable()
    }, [])
    return { personalDisable, setPersonalDisable }
}
export default UseGetPersonalDisable;