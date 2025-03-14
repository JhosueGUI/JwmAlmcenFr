import React, { useState,useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useEffect } from "react";
import { DataRoles } from "../Data/DataRoles";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axios from "axios";

export const ModalEliminarRol = ({ pasarAbrirModalEliminar, pasarCerrarModalEliminar, pasarSetRol, pasarRolSeleccionado }) => {
    //obtener token
    const { obtenerToken } = useContext(AuthContext)
    //traer data rol
    const [rolData, setRolData] = useState(DataRoles)
    //#region para eliminar rol
    const EliminarRol = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const respuestaDelete = await axios.delete(`http://127.0.0.1:8000/api/almacen/rol/delete/${pasarRolSeleccionado.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/rol/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                pasarSetRol(respuestaGet.data.data)
                const mensajeDelServidor = respuestaDelete.data.resp
                // Mostrar un mensaje de éxito
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                pasarCerrarModalEliminar()
            }
        } catch (error) {
            console.error("Error al agregar una categoría:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el Inventario', life: 3000 });
        }
    }
    //plasmar el valor a los input
    useEffect(() => {
        if (pasarRolSeleccionado) {
            setRolData({
                ...rolData,
                nombre: pasarRolSeleccionado.nombre
            })
        }
    }, [pasarRolSeleccionado])

    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Eliminación de Rol cancelado', life: 3000 });
    };

    const confirmarEliminacion = () => {
        confirmDialog({
            message: '¿Está seguro de Eliminar este Rol?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: EliminarRol,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Eliminar" onClick={confirmarEliminacion} className="p-button-danger" />
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
                    <h3>Eliminar Rol</h3>
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
                            <InputText id="rol" style={{ width: '100%' }} value={rolData.nombre} disabled />
                            <label htmlFor="rol" style={{ textAlign: "center", }}>Rol</label>
                        </FloatLabel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
