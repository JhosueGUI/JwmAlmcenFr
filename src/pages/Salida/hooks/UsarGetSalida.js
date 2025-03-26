import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getSalida } from "../Services/SalidaApi";

const UsarGetSalida = () => {
    const [data2, setData2] = useState([]);
    const { obtenerToken } = useContext(AuthContext);
    useEffect(() => {
        const FetchSalida = async () => {
            try {
                const token = obtenerToken();
                const respuesta = await getSalida(token);
                const Adaptado = respuesta.map(item => {
                    let personal = null;
                    if (item.personal && item.personal.persona) {
                        personal = `${item.personal.persona?.nombre || ''} ${item.personal.persona?.apellido_paterno || ''} ${item.personal.persona?.apellido_materno || ''}`;
                    }
                    return {
                        id: item.id || '',
                        fecha: item.fecha || '',
                        vale: item.vale || '',
                        tipo_operacion: item.transaccion?.tipo_operacion || '',
                        destino: item.destino || '',
                        personal: personal,
                        personalId: item.personal?.id || '',
                        unidad: item.unidad || '',
                        duracion_neumatico: item.duracion_neumatico || '',
                        kilometraje_horometro: item.kilometraje_horometro || '',
                        fecha_vencimiento: item.fecha_vencimiento || '',
                        SKU: item.transaccion.producto?.SKU || '',
                        familia: item.transaccion.producto.articulo.sub_familia.familia?.familia || '',
                        sub_familia: item.transaccion.producto.articulo.sub_familia?.nombre || '',
                        articulo: item.transaccion.producto.articulo?.nombre || '',
                        marca: item.transaccion.marca || '',
                        precio_dolares: item.transaccion.producto.articulo?.precio_dolares || 0,
                        precio_soles: item.transaccion.producto.articulo?.precio_soles || 0,
                        stock_logico: item.transaccion.producto.inventario?.stock_logico || '',
                        unidad_medida: item.transaccion.producto.unidad_medida?.nombre || '',
                        salida: item.numero_salida || '',
                        precio_unitario_soles: item.transaccion?.precio_unitario_soles || 0,
                        precio_total_soles: item.transaccion?.precio_total_soles || 0,
                        precio_unitario_dolares: item.transaccion?.precio_unitario_dolares || 0,
                        precio_total_dolares: item.transaccion?.precio_total_dolares || 0,
                        observaciones: item.transaccion?.observaciones || ''
                    }
                })
                setData2(Adaptado);
            } catch (error) {
                console.error("Error al obtener Salida:", error);
            }
        }
        FetchSalida();
    }, [])
    return { data2, setData2 }
}
export default UsarGetSalida;