import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { getIngreso } from "../Services/IngresoApi";

const UseGetIngreso = () => {
    const [data, setData] = useState([])
    const { obtenerToken } = useContext(AuthContext)
    useEffect(() => {
        const Fetch = async () => {
            try {
                const token = obtenerToken();
                const response = await getIngreso(token);
                const adapted = response.map(item => {
                    const transaccion = item.transaccion || {};
                    const producto = transaccion.producto || {};
                    const articulo = producto.articulo || {};
                    const sub_familia = articulo.sub_familia || {};
                    const familia = sub_familia.familia || {};
                    const proveedor_producto = transaccion.proveedor_producto || {};
                    const proveedor = proveedor_producto.proveedor || {};
                    const inventario = (producto.inventario && producto.inventario) || {};
                    return {
                        id: item.id || '',
                        fecha: item.fecha || '',
                        guia_remision: item.guia_remision || '',
                        tipo_operacion: transaccion.tipo_operacion || '',
                        tipo_cp: item.tipo_cp || '',
                        documento: item.documento || '',
                        orden_compra: item.orden_compra || '',
                        codigo_proveedor: proveedor.id || '',
                        proveedor: proveedor.razon_social || '',
                        SKU: producto.SKU || '',
                        familia: familia.familia || '',
                        sub_familia: sub_familia.nombre || '',
                        articulo: articulo.nombre || '',
                        marca: transaccion.marca || producto.marca || '',
                        precio_dolares: articulo.precio_dolares || 0,
                        precio_soles: articulo.precio_soles || 0,
                        stock_logico: inventario.stock_logico || '',
                        unidad_medida: producto.unidad_medida?.nombre || '',
                        ingreso: item.numero_ingreso || '',
                        precio_unitario_soles: transaccion.precio_unitario_soles || 0,
                        precio_total_soles: transaccion.precio_total_soles || 0,
                        precio_unitario_dolares: transaccion.precio_unitario_dolares || 0,
                        precio_total_dolares: transaccion.precio_total_dolares || 0,
                        observaciones: transaccion.observaciones || '',
                    };
                });
                setData(adapted)
            } catch (error) {
                console.error("Error al obtener ingreso:", error);
            }
        }
        Fetch()
    }, []);
    return { data,setData };
}
export default UseGetIngreso;