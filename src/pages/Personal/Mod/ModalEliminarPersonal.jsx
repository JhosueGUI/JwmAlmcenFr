import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
//importar axios
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
const ModalEliminarPersonal = ({ pasarAbrirModalEliminar, pasarCerrarModalEliminar, pasarPersonalSeleccionado, pasarSetPersonal }) => {
    //traer token
    const {obtenerToken}=useContext(AuthContext)
    const EliminarPersonal = async () => {
        try {
            const token = obtenerToken();
            if (token && pasarPersonalSeleccionado) {
                const respuestaPost = await axios.delete(`http://127.0.0.1:8000/api/almacen/personal/delete/${pasarPersonalSeleccionado.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/personal/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                //para que se visualice en la tabla debe mandarse mediante esto segun la estructura
                const personalTransformado = respuestaGet.data.data.map(item => ({
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
                pasarSetPersonal(personalTransformado)

                const mensajeDelServidor = respuestaPost.data.resp
                // Mostrar un mensaje de éxito con React Prime
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                // Cerrar el modal después de agregar la categoría
                pasarCerrarModalEliminar();
            } else {
                toast.current.show({ severity: 'info', summary: 'Observación', detail: 'No se capturo ningun Personal', life: 3000 });
            }
        } catch (error) {
            console.error("Error al asignar rol:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al asignar rol: ${error.message}`, life: 3000 });
        }
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Eliminación de personal cancelada', life: 3000 });
    };

    const confirmarEliminar = () => {
        confirmDialog({
            message: '¿Está seguro de que eliminar este personal?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: EliminarPersonal,
            reject
        });
    };
    //#region Estado para Poder traer los datos del personal seleccionado
    const [nombreCompleto, setNombreCompleto] = useState('')
    useEffect(() => {
        if (pasarPersonalSeleccionado) {
            const nombreCompleto = `${pasarPersonalSeleccionado.nombre} ${pasarPersonalSeleccionado.apellido}`
            setNombreCompleto(nombreCompleto)
        }
    }, [pasarPersonalSeleccionado])

    const footer = (
        <div>
            <Button label="Eliminar" onClick={confirmarEliminar} className="p-button-danger" />
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
                    <h3>Eliminar Personal</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalEliminar} />
                </div>}
                visible={pasarAbrirModalEliminar}
                style={{ width: '20%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalEliminar}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <FloatLabel>
                            <InputText id="nombre" style={{ width: '100%' }} value={nombreCompleto} disabled />
                            <label htmlFor="nombre" style={{ textAlign: "center", }}>Nombre Completo</label>
                        </FloatLabel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ModalEliminarPersonal;