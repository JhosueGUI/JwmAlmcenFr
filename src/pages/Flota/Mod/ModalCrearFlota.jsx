import React, { useState,useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { DataFlota } from "../Data/DataFlota";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import GetPersonalFlota from "../Services/GetPersonalFlota";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
export const ModalCrearFlota = ({ pasarSetFlota }) => {
    //obtener token
    const {obtenerToken}=useContext(AuthContext)
    const [modal, setModal] = useState(false)
    const abrirModal = () => {
        setModal(true)
    }
    const cerrarModal = () => {
        setModal(false)
    }
    const [dataFlota, setDataFlota] = useState(DataFlota)
    const AgregarFlota = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const respuestaPost = await axios.post("http://127.0.0.1:8000/api/almacen/flota/create", dataFlota, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(respuestaPost.data)

                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/flota/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const FlotaAdaptado = respuestaGet.data.data.map(item => {
                    let conductor = null;

                    if (item.personal && item.personal.persona) {
                        conductor = `${item.personal.persona?.nombre || ''} ${item.personal.persona?.apellido_paterno || ''} ${item.personal.persona?.apellido_materno || ''}`;
                    }
                    return {
                        id: item.id || '',
                        placa: item.placa || '',
                        personalId:item.personal_id ||'',
                        conductor: conductor,
                        tipo: item.tipo || '',
                        marca: item.marca || '',
                        modelo: item.modelo || '',
                        empresa: item.empresa || '',
                    };
                });
                pasarSetFlota(FlotaAdaptado)
                const mensajeDelServidor = respuestaPost.data.resp
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                cerrarModal();
            }else {
                toast.current.show({ severity: 'info', summary: 'Observación', detail: "Placa No ingresado", life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el Proveedor', life: 3000 });
        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataFlota({
            ...dataFlota,
            [name]: value.toUpperCase()
        })
    }
    // Manejar cambios en los campos del formulario para solo Personal
    const handlePersonalChange = (personalSeleccionado) => {
        setDataFlota({
            ...dataFlota,
            personal_id: personalSeleccionado.id
        });
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Creación de Flota cancelada', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de crear esta Flota?',
            header: 'Confirmar Creación',
            icon: 'pi pi-exclamation-triangle',
            accept: AgregarFlota,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarCreacion} className="p-button-success" />
            <Button label="Cancelar" onClick={cerrarModal} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            <ConfirmDialog />
            {/* Contenido */}
            <Button icon="pi pi-plus"  label="Crear Flota" onClick={abrirModal}  severity="info" outlined  style={{ color:'#1A55B0' }} />
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Crear Flota</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" onClick={cerrarModal} aria-label="Cancel" />
                </div>}
                visible={modal}
                style={{ width: '20%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModal}
                closable={false}
            >
                <form onSubmit={AgregarFlota}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <FloatLabel>
                                <InputText id="placa" name="placa" style={{ width: '100%' }} value={dataFlota.placa} onChange={handleInputChange} />
                                <label htmlFor="placa" style={{ textAlign: "center", }}>Número de Placa</label>
                            </FloatLabel>
                            <GetPersonalFlota pasarSetSalidas={handlePersonalChange}/>
                            <FloatLabel>
                                <InputText id="tipo" name="tipo" style={{ width: '100%' }} value={dataFlota.tipo} onChange={handleInputChange} />
                                <label htmlFor="tipo" style={{ textAlign: "center", }}>Tipo</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText id="marca" name="marca" style={{ width: '100%' }} value={dataFlota.marca} onChange={handleInputChange} />
                                <label htmlFor="marca" style={{ textAlign: "center", }}>Marca</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText id="modelo" name="modelo" style={{ width: '100%' }} value={dataFlota.modelo} onChange={handleInputChange} />
                                <label htmlFor="modelo" style={{ textAlign: "center", }}>Modelo</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText id="empresa" name="empresa" style={{ width: '100%' }} value={dataFlota.empresa} onChange={handleInputChange} />
                                <label htmlFor="empresa" style={{ textAlign: "center", }}>Empresa</label>
                            </FloatLabel>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
};
