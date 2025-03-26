import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getSalidaCombustible } from "../Services/SalidaCombustibleApi";

const UsarGetSalidaCombustible = () => {
    const [data, setData] = useState([])
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchSalida = async () => {
            try {
                const token = obtenerToken();
                const respuesta = await getSalidaCombustible(token);
                const Adaptado = respuesta.map(item => {
                    return {
                        id: item.id || '',
                        fecha: item.fecha || '',
                        flota_id: item.flota?.id || '',
                        placa: item.flota?.placa || '',
                        tipo: item.flota?.tipo || '',
                        personal_id: item.personal?.id || '',
                        nombre: item.personal?.persona?.nombre || '',
                        destino_combustible_id: item.destino_combustible?.id || '',
                        destino: item.destino_combustible?.nombre || '',
                        numero_salida_ruta: item.numero_salida_ruta || '',
                        numero_salida_stock: item.numero_salida_stock || '',
                        precio_total_igv: item.precio_total_igv || '',
                        precio_unitario_soles: item.precio_unitario_soles || '',
                        precio_total_soles: item.precio_total_soles || '',
                        contometro_surtidor: item.contometro_surtidor || '',
                        margen_error_surtidor: item.margen_error_surtidor || '',
                        resultado: item.resultado || '',
                        precinto_nuevo: item.precinto_nuevo || '',
                        precinto_anterior: item.precinto_anterior || '',
                        kilometraje: item.kilometraje || '',
                        horometro: item.horometro || '',
                        observacion: item.observacion || ''
                    }
                })
                setData(Adaptado);
            } catch (error) {
                console.error("Error al obtener Salida Combustible:", error);
            }
        }
        FetchSalida();
    },[])
    return { data, setData }
}
export default UsarGetSalidaCombustible;