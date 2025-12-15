import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileUpload } from 'primereact/fileupload';
import { ProgressSpinner } from 'primereact/progressspinner'; // Importar ProgressSpinner
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axios from "axios";

export const SubirArchivoPersonal = ({ pasarSetPersonal }) => {
    const { obtenerToken } = useContext(AuthContext);
    const [modal, setModal] = useState(false);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(false); // Estado para controlar la carga

    const abrirModal = () => {
        setModal(true);
    };

    const cerrarModal = () => {
        setModal(false);
    };

    const uploadRef = useRef(null);

    const urlSubirArchivo = "https://jwmalmcenb-production.up.railway.app/api/almacen/personal/archivo";

    const SubirArchivo = async () => {
        try {
            const token = obtenerToken();
            if (token && archivoSeleccionado) {
                const formData = new FormData();
                formData.append("personal_excel", archivoSeleccionado);

                // Mostrar spinner al iniciar la carga
                setCargando(true);

                const respuestaPost = await axios.post(urlSubirArchivo, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                // Ocultar spinner al finalizar la carga
                setCargando(false);

                // Obtener y transformar datos actualizados después de la carga
                const respuestaPersonalGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/personal/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const personalTransformado = respuestaPersonalGet.data.data.map(item => ({
                    id: item.id || '',
                    nombre: item.persona?.nombre || '',
                    apellido: `${item.persona?.apellido_paterno} ${item.persona?.apellido_materno}` || '',
                    gmail: item.persona?.gmail || '',
                    numero_documento: item.persona?.numero_documento || '',
                    tipo_documento_id: item.persona?.tipo_documento_id || '',
                    area: item.area?.nombre || '',
                    area_id:item.area?.id || '',
                    habilidad: item.habilidad || '',
                    experiencia: item.experiencia || '',
                }));
                pasarSetPersonal(personalTransformado);
                const mensajeDelServidor = respuestaPost.data.resp
                // Mostrar un mensaje de éxito
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                setArchivoSeleccionado(null);
                cerrarModal();

            }
        } catch (error) {
            console.error("Error al Integrar Archivo:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response.data?.error || 'Error al Editar el Inventario', life: 3000 });
            if(error.response.data?.message){
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response.data?.message || 'Error al Editar el Inventario', life: 3000 });
            }
            setCargando(false);
            
        }
    };
    const handleFileSelect = (e) => {
        // Mostrar el nombre del archivo seleccionado
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
            accept: SubirArchivo,
            reject
        });
    };

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
            style={{background:'#1A55B0',border:'1px solid #1A55B0'}}
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
                            onSelect={handleFileSelect}
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
