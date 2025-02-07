import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useEffect } from "react";
import { DataPersonal } from "../Data/DataPersonal";
import { ProgressSpinner } from 'primereact/progressspinner';

export const ModalEnvioDeCredencial = ({ pasarAbrirModalEnviar, pasarCerrarModalEnviar, pasarPersonalSeleccionado }) => {
    //obtener token
    const { obtenerToken } = useContext(AuthContext)

    const [cargando, setCargando] = useState(false);

    //#region Estado para obtener la data inicial
    const [dataPersonal, setDataPersonal] = useState(DataPersonal)

    //Enviar credenciales
    const EnviarCredenciales = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                setCargando(true);
                const respuestaPost = await axios.post(`https://jwmalmcenb-production.up.railway.app/api/almacen/personal/credenciales/${pasarPersonalSeleccionado.id}`,{},{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(respuestaPost)
                const mensajeDelServidor = respuestaPost.data.resp
                // Mostrar un mensaje de éxito con React Prime
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                setCargando(false);
                pasarCerrarModalEnviar();
            }
        } catch (error) {
            console.error("Error al Enviar Credenciales :", error);
            // Mostrar un mensaje de error con React Prime
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.resp || 'Error al Enviar Credenciales', life: 3000 });
            setCargando(false);
        }
    }
    //plasmar en los inputs el valor
    useEffect(() => {

        if (pasarPersonalSeleccionado) {
            // Separar el apellido completo en apellido paterno y materno
            const [apellidoPaterno, apellidoMaterno] = pasarPersonalSeleccionado.apellido.split(' ');
            setDataPersonal({
                nombre: pasarPersonalSeleccionado.nombre,
                apellido_paterno: apellidoPaterno || '',
                apellido_materno: apellidoMaterno || '',
                gmail: pasarPersonalSeleccionado.gmail,
            })
        }
    }, [pasarPersonalSeleccionado])
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Envio de Credencial cancelada', life: 3000 });
    };

    const ConfirmarEnviar = () => {
        confirmDialog({
            message: '¿Está seguro de Enviar las credenciales de este personal?',
            header: 'Confirmar Envio',
            icon: 'pi pi-exclamation-triangle',
            accept: EnviarCredenciales,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Enviar" onClick={ConfirmarEnviar} className="p-button-success" />
            <Button label="Cancelar" onClick={pasarCerrarModalEnviar} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Enviar Credenciales</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalEnviar} />
                </div>}
                visible={pasarAbrirModalEnviar}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalEnviar}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div className="primerDiv" style={{ display: 'flex', gap: '10px' }}>
                            <div className="nombre" style={{ width:'100%' }}>
                                <FloatLabel>
                                    <InputText id="nombre" name="" style={{ width: '100%' }} value={dataPersonal.nombre} disabled />
                                    <label htmlFor="nombre" style={{ textAlign: "center", }}>Nombre</label>
                                </FloatLabel>
                            </div>
                            <div className="apellido" style={{ width:'100%' }}>
                                <FloatLabel>
                                    <InputText id="nombre" name="" style={{ width: '100%' }} value={`${dataPersonal.apellido_paterno} ${dataPersonal.apellido_materno}`} disabled />
                                    <label htmlFor="nombre" style={{ textAlign: "center", }}>Apellidos</label>
                                </FloatLabel>
                            </div>

                        </div>
                        <FloatLabel>
                            <InputText id="nombre" name="" style={{ width: '100%' }} value={dataPersonal.gmail} disabled />
                            <label htmlFor="nombre" style={{ textAlign: "center", }}>Gmail</label>
                        </FloatLabel>
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
