import React, { useState,useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { GetAccesos } from "../Services/GetAccesos";
import { DataRoles } from "../Data/DataRoles";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

export const ModalAsignarAccesos = ({pasarAbrirModalAsignar,pasarCerrarModalAsignar,pasarRolSeleccionado}) => {
    
    //traer token
    const {obtenerToken}=useContext(AuthContext)

    //traer la data
    const [dataRol,setDataRol]=useState([])
    //#region para administrar accesoso
    const AsignarAccesos=async()=>{
        try {
            const token =obtenerToken()     
            if(token){
                const respuestaPost = await axios.post(`https://jwmalmcenb-production.up.railway.app/api/almacen/rol/asignar_acceso/${pasarRolSeleccionado.id}`,dataRol,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const mensajeDelServidor = respuestaPost.data.resp
                // Mostrar un mensaje de éxito
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                pasarCerrarModalAsignar()
            }
        } catch (error) {
            console.error("Error al asignar Accesos:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el Inventario', life: 3000 });
        }
    }
     // Manejar cambios en los campos del formulario para solo Accesos
     const handleAccesosChange = (accesosSeleccionados) => {
        setDataRol({
            ...dataRol,
            accesos: accesosSeleccionados.map(acceso => acceso.id)
        });
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Asignación de Accesos cancelado', life: 3000 });
    };

    const confirmarAsiganacion = () => {
        confirmDialog({
            message: '¿Está seguro de asignar Accesos?',
            header: 'Confirmar Asignación',
            icon: 'pi pi-exclamation-triangle',
            accept: AsignarAccesos,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarAsiganacion} className="p-button-success" />
            <Button label="Cancelar" onClick={pasarCerrarModalAsignar} className="p-button-secondary" />
        </div>
    );
    return (
        <>
        {/* Confirmacion */}
        <Toast ref={toast} />
            {/* Contenido */}
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Asignar Accesos</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalAsignar}/>
                </div>}
                visible={pasarAbrirModalAsignar}
                style={{ width: '25%', minWidth: '300px',height: '350px'  }}
                footer={footer}
                onHide={pasarCerrarModalAsignar}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <GetAccesos pasarSetRoles={handleAccesosChange}/>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
