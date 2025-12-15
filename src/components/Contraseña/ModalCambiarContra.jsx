import React, { useContext, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Password } from 'primereact/password';
import { AuthContext } from "../../context/AuthContext";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

import axios from "axios";

export const ModalCambiarContra = ({ pasarAbrirModal, pasarCerrarModa }) => {
    // Obtener token del contexto
    const { obtenerToken } = useContext(AuthContext);

    // Estado para las contraseñas
    const [contraseñaActual, setContraseñaActual] = useState('');
    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [repetirContraseña, setRepetirContraseña] = useState('');

    // Cambiar contraseña
    const cambiarPassword = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                const data = {
                    contraseña_actual: contraseñaActual,
                    nueva_contraseña: nuevaContraseña,
                    repetir_contraseña: repetirContraseña,
                };
                const respuestaPost = await axios.post("https://jwmalmcenb-production.up.railway.app/api/almacen/password/cambiar", data, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const mensajeDelServidor = respuestaPost.data.resp
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                pasarCerrarModa();
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.error, life: 3000 });
        }
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);

    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Cambio de contraseña cancelada', life: 3000 });
    };

    const confirmarCambiar = () => {
        confirmDialog({
            message: '¿Está seguro de que desea Cambiar su Contraseña?',
            header: 'Confirmar cambiar de Contraseña',
            icon: 'pi pi-exclamation-triangle',
            accept: cambiarPassword,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarCambiar} className="p-button-success" />
            <Button label="Cancelar" onClick={pasarCerrarModa} className="p-button-secondary" />
        </div>
    );

    return (
        <>{/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Dialog
                header={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                        <h3>Cambiar Contraseña</h3>
                        <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModa} />
                    </div>
                }
                visible={pasarAbrirModal}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModa}
                closable={false}
            >
                <div className="p-fluid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div className="p-field">
                        <label htmlFor="contraseñaActual">Ingrese su Contraseña Actual</label>
                        <Password id="contraseñaActual" value={contraseñaActual} onChange={(e) => setContraseñaActual(e.target.value)} feedback={false} toggleMask />
                    </div>
                    <div className="ContrasenasNuevas" style={{ display:'flex',gap:'10px' }}>
                        <div className="p-field" style={{ width:'100%' }}>
                            <label htmlFor="nuevaContraseña">Ingrese su nueva Contraseña</label>
                            <Password id="nuevaContraseña" value={nuevaContraseña} onChange={(e) => setNuevaContraseña(e.target.value)} feedback={true} toggleMask />
                        </div>
                        <div className="p-field" style={{ width:'100%' }}>
                            <label htmlFor="repetirContraseña">Ingrese nuevamente la contraseña</label>
                            <Password id="repetirContraseña" value={repetirContraseña} onChange={(e) => setRepetirContraseña(e.target.value)} feedback={true} toggleMask />
                        </div>
                    </div>
                </div>
            </Dialog>
        </>

    );
};
