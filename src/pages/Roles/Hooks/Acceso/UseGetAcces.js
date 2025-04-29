import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { getAcces } from "../../Services/ApiAcces";

const UseGetAcces = () => {
    const { obtenerToken } = useContext(AuthContext)
    const [acceso, setAcceso] = useState([])
    useEffect(() => {
        const Fetch = async () => {
            try {
                const token = obtenerToken()
                const response = await getAcces(token)
                const transformToTreeData = (items) => {
                    return items.map(item => ({
                        key: item.id.toString(),
                        label: item.nombre,
                        children: item.sub_acceso && item.sub_acceso.length > 0 ? transformToTreeData(item.sub_acceso) : [],
                        data: item // Mantener el objeto original si lo necesitas
                    }));
                };
                setAcceso(transformToTreeData(response))
            } catch (error) {
                console.log('Error', error)
            }
        }
        Fetch()
    }, [])
    return { acceso, setAcceso }
}
export default UseGetAcces;