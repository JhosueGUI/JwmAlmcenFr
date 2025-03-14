import { useContext, useEffect } from "react";
import { useState } from "react";
import { getMovimientos } from "../service/ApiMovimiento";
import { AuthContext } from "../../../../context/AuthContext";

const UsarGetMovimiento = () => {
    const [data, setData] = useState([]);
    const{obtenerToken} = useContext(AuthContext);
    useEffect(() => {
        const FetchMovimiento = async () => {
            try {
                const token = obtenerToken();
                const respuestaGet = await getMovimientos(token);

                const adaptarRespuesta = respuestaGet.map(movimiento => ({
                    id: movimiento.id,
                    fecha: movimiento.fecha,
                    modo: movimiento.modo?.nombre_modo,
                    modo_id: movimiento.modo?.id,
                    n_operacion: movimiento.n_operacion,
                    cliente: movimiento.cliente?.nombre_cliente,
                    cliente_id: movimiento.cliente?.id,
                    ingreso: movimiento.ingreso,
                    egreso: movimiento.egreso,
                    descripcion: movimiento.descripcion,
                    solicitante: movimiento.solicitante,
                    sub_destino_placa: movimiento.sub_destino_placa,
                    sub_categoria_id: movimiento.sub_categoria?.id,
                    categoria: movimiento.sub_categoria?.categoria?.nombre_categoria,
                    sub_categoria: movimiento.sub_categoria?.nombre_sub_categoria,
                    estado_id: movimiento.estado?.id,
                    estado: movimiento.estado?.nombre_estado_comprobante,
                    rendicion_id: movimiento.rendicion?.id,
                    rendicion: movimiento.rendicion?.nombre_rendicion,
                    serie: movimiento.serie,
                    n_factura: movimiento.n_factura,
                    fecha_factura: movimiento.fecha_factura,
                    obs: movimiento.obs,
                    n_retencion: movimiento.n_retencion,
                    fecha_retencion: movimiento.fecha_retencion,
                    empresa_id: movimiento.empresa?.id,
                    moneda_id: movimiento.moneda?.id,
                    persona_finanza_id: movimiento.persona_finanza?.id,
                    proveedor_finanza_id: movimiento.proveedor_finanza?.id,
                }));
                setData(adaptarRespuesta);
            } catch (error) {
                console.error('Error al obtener detalle:', error);
            }
        }
        FetchMovimiento();
    }, []);
    return { data, setData };
}
export default UsarGetMovimiento;