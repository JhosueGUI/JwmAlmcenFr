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
import UseReactivePersonal from "../Hooks/UseReactivePersonal";
import { GetPersonal, getPersonalDisable } from "../Services/PersonalApi";
const ModalActivarPersonal = ({ pasarAbrirModalActivar, pasarCerrarModalActivar, pasarPersonalSeleccionado, pasarSetPersonalDisable, pasarSetPersonal }) => {
    //hooks,
    const { Reactivate } = UseReactivePersonal()
    //traer token
    const { obtenerToken } = useContext(AuthContext)
    const ActivarPersonal = async () => {
        const token = obtenerToken();
        const responseServer = await Reactivate(pasarPersonalSeleccionado.id)
        const response =await getPersonalDisable(token)
        const response2=await GetPersonal(token)
        pasarSetPersonalDisable(response)
        pasarSetPersonal(response2)
        // Mostrar un mensaje de éxito con React Prime
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: responseServer, life: 3000 });
        // Cerrar el modal después de agregar la categoría
        pasarCerrarModalActivar();
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Activación de personal cancelada', life: 3000 });
    };

    const confirmarEliminar = () => {
        confirmDialog({
            message: '¿Está seguro de activar este personal?',
            header: 'Confirmar Activación',
            icon: 'pi pi-exclamation-triangle',
            accept: ActivarPersonal,
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
            <Button label="Activar" onClick={confirmarEliminar} className="p-button-info" />
            <Button label="Cancelar" onClick={pasarCerrarModalActivar} className="p-button-secondary" />
        </div>
    );

    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Activar Personal</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalActivar} />
                </div>}
                visible={pasarAbrirModalActivar}
                style={{ width: '20%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalActivar}
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

export default ModalActivarPersonal;