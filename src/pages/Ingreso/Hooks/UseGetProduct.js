import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../context/AuthContext"
import { getProducto } from "../Services/IngresoApi"

const UseGetProduct = () => {
    const [producto, setProducto] = useState([])
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchProducto = async () => {
            const token = obtenerToken()
            const respuesta = await getProducto(token)
            setProducto(respuesta)
        }
        FetchProducto()
    }, [])
    return { producto }
}
export default UseGetProduct;