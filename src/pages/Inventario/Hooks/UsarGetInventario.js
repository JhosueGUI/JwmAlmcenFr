import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetInventario } from "../Services/InventarioApi";

const UsarGetInventario = () => {
    const [data, setData] = useState([])
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const FetchInventario = async () => {
            const token = obtenerToken()
            const respuesta = await GetInventario(token);
            const InventarioAdaptado = respuesta.map(item => ({
                id: item.id || '',
                ubicacion_id: item.inventario.ubicacion?.id || '',
                ubicacion: item.inventario.ubicacion?.codigo_ubicacion || '',
                SKU: item.inventario.producto?.SKU || '',
                familia_id: item.inventario?.producto?.articulo?.sub_familia?.familia_id ?? null,
                familia: item.inventario?.producto?.articulo?.sub_familia?.familia?.familia ?? null,
                sub_familia_id: item.inventario.producto.articulo?.sub_familia_id || '',
                sub_familia: item.inventario.producto.articulo.sub_familia?.nombre || '',
                nombre: item.inventario.producto.articulo?.nombre || '',
                unidad_medida_id: item.inventario.producto?.unidad_medida_id || '',
                unidad_medida: item.inventario.producto.unidad_medida?.nombre || '',

                // fecha_salida: item.inventario.producto.transacciones[1]?.salida[0]?.fecha || '',
                // fecha_ingreso: item.inventario.producto.transacciones[0]?.ingreso[0]?.fecha || '',

                precio_dolares: item.inventario.producto.articulo?.precio_dolares || 0,
                precio_soles: item.inventario.producto.articulo?.precio_soles || 0,
                valor_inventario_soles: item.valor_inventario_soles || 0,
                valor_inventario_dolares: item.valor_inventario_dolares || 0,
                
                total_ingreso: item.inventario?.total_ingreso || '',
                total_salida: item.inventario?.total_salida || '',
                stock_logico: item.inventario?.stock_logico || '',
                demanda_mensual: item.inventario?.demanda_mensual || '',
                estado_operativo: item.inventario.estado_operativo?.nombre || '',
            }))
            setData(InventarioAdaptado)
        }
        FetchInventario()
    }, [])
    return { data, setData }
}
export default UsarGetInventario;