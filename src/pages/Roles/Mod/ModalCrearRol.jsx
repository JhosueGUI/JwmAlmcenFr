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

export const ModalCrearRol = ({ pasarSetRol }) => {
    //obtener token
    const { obtenerToken } = useContext(AuthContext)
    const [modal, setModal] = useState(false)
    const funtAbrirModal = () => {
        setModal(true)
    }
    const funtCerrarModal = () => {
        setModal(false)
    }
    //#region para crear rol
    const [rolData, setRolData] = useState(DataRoles)

    const agregarRol = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const respuestaPost = await axios.post("https://jwmalmcenb-production.up.railway.app/api/almacen/rol/create", rolData, {
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
                funtCerrarModal()
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
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Creación de Rol cancelado', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de crear Rol?',
            header: 'Confirmar Creación',
            icon: 'pi pi-exclamation-triangle',
            accept: agregarRol,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarCreacion} className="p-button-success" />
            <Button label="Cancelar" onClick={funtCerrarModal} className="p-button-secondary" />
        </div>
    );
    return (
        <>

            {/* Confirmacion */}
            <Toast ref={toast} />
            <ConfirmDialog />
            {/* Contenido */}

            <Button icon="pi pi-plus" label="Agregar Rol" severity="info" outlined onClick={funtAbrirModal} style={{ color: '#1A55B0' }} />

            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Crear Rol</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={funtCerrarModal} />
                </div>}
                visible={modal}
                style={{ width: '20%', minWidth: '300px' }}
                footer={footer}
                onHide={funtCerrarModal}
                closable={false}
            >
                <form onSubmit={agregarRol}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <FloatLabel>
                                <InputText id="nombre" name='nombre' style={{ width: '100%' }} value={rolData.nombre} onChange={handleInputChange} />
                                <label htmlFor="nombre" style={{ textAlign: "center", }}>Nombre del Rol</label>
                            </FloatLabel>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
};
