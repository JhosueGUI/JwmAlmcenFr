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


export const ImportarInventario = ({ pasarSetInventario }) => {
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

    const urlSubirArchivo = "https://jwmalmcenb-production.up.railway.app/api/almacen/inventario_valorizado/importar";

    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)

    const SubirInventario = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const data = new FormData()
                data.append("inventario_excel", archivoSeleccionado)

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

                const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/inventario_valorizado/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(respuestaGet.data.data)

                // Mapeamos los datos recibidos para ajustarlos a la estructura deseada
                const InventarioAdaptado = respuestaGet.data.data.map(item => ({
                    id: item.id || '',
                    ubicacion: item.inventario.ubicacion?.codigo_ubicacion || '',
                    SKU: item.inventario.producto?.SKU || '',
                    familia: item.inventario.producto.articulo.sub_familia.familia?.familia || '',
                    sub_familia: item.inventario.producto.articulo.sub_familia?.nombre || '',
                    nombre: item.inventario.producto.articulo?.nombre || '',
                    unidad_medida: item.inventario.producto.unidad_medida?.nombre || '',
                    fecha_salida: item.inventario.producto.transacciones[1]?.salida[0]?.fecha || '',
                    fecha_ingreso: item.inventario.producto.transacciones[0]?.ingreso[0]?.fecha || '',
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
                pasarSetInventario(InventarioAdaptado)
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
            accept: SubirInventario,
            reject
        });
    };
    const re=()=>{
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
