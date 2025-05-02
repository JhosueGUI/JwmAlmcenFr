import React, { useState, useEffect,useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import axios from "axios";
import { DataFlota } from "../Data/DataFlota";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const ModalEliminarFlota = ({ pasarAbrirModalEliminar, pasarCerrarModalEliminar, pasarSetFlota, pasarFlotaSeleccionado }) => {
    //obtner token
    const {obtenerToken}=useContext(AuthContext)
    const [dataFlota, setDataFlota] = useState(DataFlota);

    useEffect(() => {
        if (pasarFlotaSeleccionado) {
            setDataFlota({
                placa: pasarFlotaSeleccionado.placa || '',
                tipo: pasarFlotaSeleccionado.tipo || '',
                modelo: pasarFlotaSeleccionado.modelo || '',
                marca: pasarFlotaSeleccionado.marca || '',
            });
        }
    }, [pasarFlotaSeleccionado]);

    const EliminarFlota = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const respuestaDelete = await axios.delete(`https://jwmalmcenb-production.up.railway.app/api/almacen/flota/delete/${pasarFlotaSeleccionado.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Actualizar la lista de flotas después de eliminar una flota
                const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/flota/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const FlotaAdaptado = respuestaGet.data.data.map(item => {
                    let conductor = null;
                    if (item.personal && item.personal.persona) {
                        conductor = `${item.personal.persona.nombre || ''} ${item.personal.persona.apellido_paterno || ''} ${item.personal.persona.apellido_materno || ''}`;
                    }
                    return {
                        id: item.id || '',
                        placa: item.placa || '',
                        personalId: item.personal_id || '',
                        conductor: conductor,
                        tipo: item.tipo || '',
                        marca: item.marca || '',
                        modelo: item.modelo || '',
                        empresa: item.empresa || '',
                    };
                });

                pasarSetFlota(FlotaAdaptado);
                const mensajeDelServidor = respuestaDelete.data.resp
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                pasarCerrarModalEliminar();
            }
            else {
                Toast.current.show({ severity: 'info', summary: 'Observación', detail: "Placa No ingresado", life: 3000 });
            }
        } catch (error) {
            console.error("Error eliminando la flota:", error);
        }
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);

    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Eliminación de Flota cancelada', life: 3000 });
    };

    const ConfirmarEliminacion = () => {
        confirmDialog({
            message: '¿Está seguro de eliminar esta Flota?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: EliminarFlota,
            reject
        });
    };

    const footer = (
        <div>
            <Button label="Eliminar" onClick={ConfirmarEliminacion} className="p-button-danger" />
            <Button label="Cancelar" onClick={pasarCerrarModalEliminar} className="p-button-secondary" />
        </div>
    );

    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Dialog
                header={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                        <h3>Eliminar Flota</h3>
                        <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalEliminar} />
                    </div>
                }
                visible={pasarAbrirModalEliminar}
                style={{ width: '20%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalEliminar}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div className="primerdiv" style={{ display: 'flex', gap: '10px' }}>
                            <div className="placa">
                                <FloatLabel>
                                    <InputText id="placa" style={{ width: '100%' }} value={dataFlota.placa} disabled />
                                    <label htmlFor="placa" style={{ textAlign: "center" }}>Número de Placa</label>
                                </FloatLabel>
                            </div>
                            <div className="tipo">
                                <FloatLabel>
                                    <InputText id="tipo" style={{ width: '100%' }} value={dataFlota.tipo} disabled />
                                    <label htmlFor="tipo" style={{ textAlign: "center" }}>Tipo</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div className="segundodiv" style={{ display: 'flex', gap: '10px' }}>
                            <div className="modelo">
                                <FloatLabel>
                                    <InputText id="modelo" style={{ width: '100%' }} value={dataFlota.modelo} disabled />
                                    <label htmlFor="modelo" style={{ textAlign: "center" }}>Modelo</label>
                                </FloatLabel>
                            </div>
                            <div className="marca">
                                <FloatLabel>
                                    <InputText id="marca" style={{ width: '100%' }} value={dataFlota.marca} disabled />
                                    <label htmlFor="marca" style={{ textAlign: "center" }}>Marca</label>
                                </FloatLabel>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ModalEliminarFlota;
