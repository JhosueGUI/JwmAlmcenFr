import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import UseDeleteMovimiento from "../../hooks/Movimiento/UseDeleteMovimiento";
import { useContext, useRef } from "react";
import { AuthContext } from "../../../../../context/AuthContext";
import { getModoMovimiento, getMovimientos } from "../../service/ApiMovimiento";

export const ModalDeletMovimiento = ({ cerrarModal, modal, pasarSetData, pasarMovimientoSeleccionado }) => {
    //token
    const { obtenerToken } = useContext(AuthContext)
    //hooks
    const { Delete } = UseDeleteMovimiento()

    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Eliminación de Movimiento cancelado', life: 3000 });
    };
    const confirm = async () => {
        const token = obtenerToken()
        const responseServer = await Delete(pasarMovimientoSeleccionado.id);
        const response = await getMovimientos(token)
        const adaptarRespuesta = response.map(movimiento => ({
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
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: responseServer, life: 3000 });
        pasarSetData(adaptarRespuesta)
        cerrarModal();
    }

    const confirmarEliminacion = () => {
        confirmDialog({
            message: '¿Está seguro de Eliminar este movimiento?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: confirm,
            reject
        });
    };

    const footer = (
        <div className="botonesFooter" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={cerrarModal} />
            <Button label="Confirmar" icon="pi pi-check" className="p-button-primary" onClick={confirmarEliminacion} />
        </div>
    );

    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            <ConfirmDialog />
            {/* Contenido */}
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="header1" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '26px', color: '#3B75F1' }}>Eliminar Movimiento</label>
                        <label style={{ fontSize: '18px', fontWeight: 'normal' }}>En esta sección usted puede eliminar el movimiento </label>
                    </div>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={cerrarModal} />
                </div>}
                visible={modal}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModal}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    </div>
                </div>
            </Dialog>
        </>
    );
};
