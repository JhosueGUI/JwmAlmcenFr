import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileUpload } from 'primereact/fileupload';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';


export const ImportarIngreso = ({ pasarSetIngreso }) => {
    //#region para abrir y cerrar Modal
    const [modal, setModal] = useState(false)
    const abrirModal = () => {
        setModal(true)
    }
    const cerrarModal = () => {
        setModal(false)
    }
    //#region para el cargado
    const [cargando, setCargando] = useState(false);

    //#region para subir archivo
    const { obtenerToken } = useContext(AuthContext)

    const uploadRef = useRef(null);

    const urlSubirArchivo = "http://127.0.0.1:8000/api/almacen/ingreso/importar";

    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)

    const SubirFlota = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const data = new FormData()
                data.append("ingreso_excel", archivoSeleccionado)

                // Mostrar spinner al iniciar la carga
                setCargando(true);

                const respuestaPost = await axios.post(urlSubirArchivo, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                })

                // Ocultar spinner al finalizar la carga
                setCargando(false);

                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/ingreso/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const IngresoAdaptado = respuestaGet.data.data.map(item => {
                    // Acceso directo a transaccion para evitar múltiples accesos anidados
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
                        precio_soles: articulo.precio_soles || '',
                        stock_logico: inventario.stock_logico || '',
                        unidad_medida: producto.unidad_medida?.nombre || '',
                        ingreso: item.numero_ingreso || '',
                        precio_unitario_soles: transaccion.precio_unitario_soles || '',
                        precio_total_soles: transaccion.precio_total_soles || '',
                        precio_unitario_dolares: transaccion.precio_unitario_dolares || 0,
                        precio_total_dolares: transaccion.precio_total_dolares || '',
                        observaciones: transaccion.observaciones || '',
                    };
                });
                pasarSetIngreso(IngresoAdaptado)

                const mensajeDelServidor = respuestaPost.data.resp
                // Mostrar un mensaje de éxito
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                setArchivoSeleccionado(null);
                cerrarModal()
            }
        } catch (error) {
            console.error("Error al Integrar Archivo:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response.data?.error || 'Error al Integrar', life: 3000 });
            if (error.response.data?.message) {
                toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response.data?.message || 'Error al Integrar', life: 3000 });
            }
            setCargando(false);
        }
    }
    //evento para majenar el seleccionado de archivo
    const handleArchivoSelect = (e) => {
        if (e.files.length > 0) {
            setArchivoSeleccionado(e.files[0]);
        }
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Integracion de Archivo cancelado', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de Subir este Archivo?',
            header: 'Confirmar Integración',
            icon: 'pi pi-exclamation-triangle',
            accept: SubirFlota,
            reject
        });
    };
    const re = () => {
        setCargando(true)
    }
    const footer = (
        <div>
            <Button label="Subir Archivo" onClick={confirmarCreacion} className="p-button-success" />
            <Button label="Cancelar" onClick={cerrarModal} className="p-button-secondary" />
        </div>
    );

    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Button
                style={{ background: '#1A55B0', border: '1px solid #1A55B0' }}
                type="button"
                icon="pi pi-upload"
                className="p-button-secondary"
                severity="info"
                onClick={abrirModal}
            />
            <Dialog
                header={
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "50px" }}>
                        <h3>Subir Archivo</h3>
                        <Button
                            icon="pi pi-times"
                            rounded
                            text
                            severity="danger"
                            aria-label="Cancel"
                            onClick={cerrarModal}
                        />
                    </div>
                }
                visible={modal}
                style={{ width: "20%", minWidth: "300px" }}
                footer={footer}
                onHide={cerrarModal}
                closable={false}
            >
                <div className="cargar" style={{ display: 'flex', gap: "10px", flexDirection: 'column' }}>
                    <div className="file" style={{ display: 'flex', width: '100%' }}>
                        <FileUpload
                            ref={uploadRef}
                            mode="basic"
                            name="demo[]"
                            url={urlSubirArchivo}
                            accept=".xls,.xlsx"
                            chooseLabel="Seleccionar Archivo"
                            style={{ width: '100%' }}
                            onSelect={handleArchivoSelect}
                        />
                    </div>
                </div>
            </Dialog>
            {/* Mostrar el spinner si está cargando */}
            {cargando && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 10000 // Asegurarse de que esté encima del modal
                }}>
                    <ProgressSpinner className="custom-progress-spinner" style={{ width: '80px', height: '80px', color: 'red' }} strokeWidth="5" fill="var(--surface-ground)" animationDuration=".8s" />
                </div>
            )}
        </>
    );
};
