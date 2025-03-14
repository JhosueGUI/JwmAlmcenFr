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


export const ImportarFlota = ({ pasarSetFlota }) => {
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

    const urlSubirArchivo = "http://127.0.0.1:8000/api/almacen/flota/importar";

    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)

    const SubirFlota = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const data = new FormData()
                data.append("flota_excel", archivoSeleccionado)

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

                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/flota/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const FlotaAdaptado = respuestaGet.data.data.map(item => {
                    let conductor = null;

                    if (item.personal && item.personal.persona) {
                        conductor = `${item.personal.persona?.nombre || ''} ${item.personal.persona?.apellido_paterno || ''} ${item.personal.persona?.apellido_materno || ''}`;
                    }
                    return {
                        id: item.id || '',
                        placa: item.placa || '',
                        personalId: item.personal_id || '',
                        conductor: conductor,
                        tipo: item.tipo || '',
                        marca: item.marca || '',
                        modelo: item.modelo || '',
                        empresa: item.empresa || '',
                    };
                });
                pasarSetFlota(FlotaAdaptado)

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
                type="button"
                icon="pi pi-upload"
                className="p-button-secondary"
                severity="info"
                style={{background:'#1A55B0',border:'1px solid #1A55B0'}}
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
