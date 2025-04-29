// ModalAsignarAccesos.js
import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { GetAccesos } from "../Components/GetAccesos";
// Importar ReactPrime Confirmar Dialogo
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import UseAsignAcces from "../Hooks/Acceso/UseAsignAcces";

export const ModalAsignarAccesos = ({ pasarAbrirModalAsignar, pasarCerrarModalAsignar, pasarRolSeleccionado }) => {
    //hooks
    const { Asing } = UseAsignAcces()
    //traer la data
    const [dataRol, setDataRol] = useState([])
    const toast = useRef(null);

    //#region para administrar accesoso
    const AsignarAccesos = async () => {
        try {
            console.log("dataRol", dataRol);
            const responseServer = await Asing(dataRol, pasarRolSeleccionado.id);
            // Mostrar un mensaje de éxito
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: responseServer, life: 3000 });
            pasarCerrarModalAsignar();
        } catch (error) {
            console.error("Error al asignar Accesos:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el Inventario', life: 3000 });
        }
    }

    // Manejar los accesos seleccionados desde el componente GetAccesos (Tree)
    const handleAccesosChange = (accesosSeleccionados) => {
        console.log("Accesos Seleccionados en Modal:", accesosSeleccionados);
        setDataRol({
            ...dataRol,
            accesos: accesosSeleccionados.map(acceso => acceso.id)
        });
        console.log("Estado dataRol:", dataRol);
    };

    //#region Estado Para Confirmacion
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
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalAsignar} />
                </div>}
                visible={pasarAbrirModalAsignar}
                style={{ width: '50%', minWidth: '300px', height: '100%' }}
                footer={footer}
                onHide={pasarCerrarModalAsignar}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <GetAccesos pasarSetRoles={handleAccesosChange} personalInicial={pasarRolSeleccionado?.id} />
                    </div>
                </div>
            </Dialog>
        </>
    );
};