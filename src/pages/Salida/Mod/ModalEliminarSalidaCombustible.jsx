import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
const ModalEliminarSalidaCombustible = ({ pasarAbrirModalEliminar, pasarCerrarModalEliminar, pasarSetSalidas, pasarSalidaSeleccionadoCombustible }) => {
    //obtenerToken
    const { obtenerToken } = useContext(AuthContext)

    const EliminarProveedor = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const respuestaPost = await axios.delete(`http://127.0.0.1:8000/api/almacen/salida_combustible/delete/${pasarSalidaSeleccionadoCombustible.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/salida_combustible/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const SalidaCombustibleAdaptado = respuestaGet.data.data.map(item => {
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
                pasarSetSalidas(SalidaCombustibleAdaptado)
                const mensajeDelServidor = respuestaPost.data.resp
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                pasarCerrarModalEliminar()
            }
        } catch (error) {
            console.log('Error', error)
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp, life: 3000 });
        }
    }
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Eliminación de Proveedor cancelada', life: 3000 });
    };

    const ConfirmarEliminacion = () => {
        confirmDialog({
            message: '¿Está seguro de eliminar esta Salida de Combustible?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: EliminarProveedor,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Eliminar" onClick={ConfirmarEliminacion} className="p-button-danger" />
            <Button label="Cancelar" onClick={pasarCerrarModalEliminar} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Eliminar Salida</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalEliminar} />
                </div>}
                visible={pasarAbrirModalEliminar}
                style={{ width: '25%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalEliminar}
                closable={false}
            >
            </Dialog>
        </>
    );
};

export default ModalEliminarSalidaCombustible;