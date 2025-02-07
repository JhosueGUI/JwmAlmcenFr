import React, { useState,useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { DataRoles } from "../Data/DataRoles";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useEffect } from "react";

export const ModalEditarRol = ({ pasarSetRol,pasarAbrirModalEdit,pasarCerrarModalEdit,pasarRolSeleccionado }) => {
    //obtener token
    const { obtenerToken } = useContext(AuthContext)

    //#region para crear rol
    const [rolData, setRolData] = useState(DataRoles)

    const editarRol = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const respuestaPost = await axios.post(`https://jwmalmcenb-production.up.railway.app/api/almacen/rol/update/${pasarRolSeleccionado.id}`, rolData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/rol/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                pasarSetRol(respuestaGet.data.data)
                const mensajeDelServidor = respuestaPost.data.resp
                // Mostrar un mensaje de éxito
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                // Cerrar el modal después de agregar la categoría
                pasarCerrarModalEdit()
            }
        } catch (error) {
            console.error("Error al agregar una categoría:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el Inventario', life: 3000 });
        }
    }
    //#region para manejar el valor de los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setRolData({
            ...rolData,
            [name]: value.toUpperCase()
        })
    }

    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Edición de Rol cancelado', life: 3000 });
    };

    const confirmarEdicion = () => {
        confirmDialog({
            message: '¿Está seguro de editar este Rol?',
            header: 'Confirmar Edición',
            icon: 'pi pi-exclamation-triangle',
            accept: editarRol,
            reject
        });
    };
    //plasmar el valor a los inputs
    useEffect(()=>{
        if(pasarRolSeleccionado){
         setRolData({
            ...rolData,
            nombre:pasarRolSeleccionado.nombre
         })
        }
    },[pasarRolSeleccionado])
    
    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarEdicion} className="p-button-success" />
            <Button label="Cancelar" onClick={pasarCerrarModalEdit} className="p-button-secondary" />
        </div>
    );
    return (
        <>

            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}

            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Editar Rol</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalEdit} />
                </div>}
                visible={pasarAbrirModalEdit}
                style={{ width: '20%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalEdit}
                closable={false}
            >
                <form onSubmit={editarRol}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <FloatLabel>
                                <InputText id="nombre" name='nombre' style={{ width: '100%' }} value={rolData.nombre} onChange={handleInputChange}  />
                                <label htmlFor="nombre" style={{ textAlign: "center", }}>Nombre del Rol</label>
                            </FloatLabel>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
};
