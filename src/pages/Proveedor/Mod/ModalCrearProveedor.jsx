import React, { useRef, useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
//importar data
import { DataProveedor } from "../Data/DataProveedor";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputMask } from "primereact/inputmask";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const ModalCrearProveedor = ({ pasarSetProveedor }) => {
    //obtener token
    const {obtenerToken}=useContext(AuthContext)
    //#region estado para abrir y cerrar Modal
    const [modal, setModal] = useState(false)
    const FuntAbrirModal = () => {
        setModal(true)
    }
    const FuntCerrarModal = () => {
        setModal(false)
    }
    //#region Estado para obtener la data inicial
    const [dataProveedor, setDataProveedor] = useState(DataProveedor)
    const AgregarProveedor = async () => {
        try {
            const token =obtenerToken()
            if (token && dataProveedor.ruc) {
                const respuestaPost = await axios.post("https://jwmalmcenb-production.up.railway.app/api/almacen/proveedor/create", dataProveedor, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/proveedor/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const ProveedorTransformado = respuestaGet.data.data.map(item => ({
                    id: item.id || '',
                    razon_social: item.razon_social || '',
                    ruc: item.ruc || '',
                    direccion: item.direccion || '',
                    forma_pago: item.forma_pago || '',
                    contacto: item.contacto || '',
                    numero_celular: item.numero_celular || ''
                }))
                pasarSetProveedor(ProveedorTransformado)
                const mensajeDelServidor = respuestaPost.data.resp
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                FuntCerrarModal()
            } else {
                toast.current.show({ severity: 'info', summary: 'Observación', detail: "Número de RUC no ingresado", life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el Proveedor', life: 3000 });
        }
    }
    //manejo de eventos de input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataProveedor({
            ...dataProveedor,
            [name]: value.toUpperCase()
        });
    };
    //#region Estado Para Consultar Api
    const ConsultarApi = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del botón
        try {
            const token = obtenerToken();
            if (token) {
                const ruc = dataProveedor.ruc;
                const respuestaGet = await axios.get(`https://jwmalmcenb-production.up.railway.app/api/almacen/proveedor/peticion/get?ruc=${ruc}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (respuestaGet.data && respuestaGet.data.data) {
                    // Actualizar el estado con los datos recibidos
                    setDataProveedor(prevState => ({
                        ...prevState,
                        razon_social: respuestaGet.data.data.razonSocial || '',
                        direccion: respuestaGet.data.data.direccion || ''
                    }));
                }
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.resp || 'Número de RUC no valido', life: 3000 });;
        }
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Creación de Proveedor cancelada', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de crear este Proveedor?',
            header: 'Confirmar Creación',
            icon: 'pi pi-exclamation-triangle',
            accept: AgregarProveedor,
            reject
        });
    };

    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarCreacion} className="p-button-success" />
            <Button label="Cancelar" onClick={FuntCerrarModal} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            <ConfirmDialog />
            {/* Contenido */}
            <Button icon="pi pi-plus" label="Agregar Proveedor" severity="info" outlined style={{ color:'#4a7de9' }} onClick={FuntAbrirModal} />
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Crear Proveedor</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={FuntCerrarModal} />
                </div>}
                visible={modal}
                style={{ width: '35%', minWidth: '300px' }}
                footer={footer}
                onHide={FuntCerrarModal}
                closable={false}
            >
                <form onSubmit={AgregarProveedor}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div className="consultarDatos" style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                                <div className="ruc" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="ruc" name="ruc" style={{ width: '100%' }} onChange={handleInputChange} value={dataProveedor.ruc} />
                                        <label htmlFor="ruc" style={{ textAlign: "center", }}>RUC</label>
                                    </FloatLabel>
                                </div>
                                <div className="consultar">
                                    <Button label="Consultar" severity="Primary" style={{ width: '100%' }} onClick={ConsultarApi} />
                                </div>
                            </div>
                            <FloatLabel>
                                <InputText id="razon_social" name="razon_social" style={{ width: '100%' }} onChange={handleInputChange} value={dataProveedor.razon_social} disabled />
                                <label htmlFor="razon_social" style={{ textAlign: "center", }}>Razon Social</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText id="direccion" name="direccion" style={{ width: '100%' }} onChange={handleInputChange} value={dataProveedor.direccion} disabled />
                                <label htmlFor="direccion" style={{ textAlign: "center", }}>Dirección</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText id="forma_pago" name="forma_pago" style={{ width: '100%' }} onChange={handleInputChange} value={dataProveedor.forma_pago} />
                                <label htmlFor="forma_pago" style={{ textAlign: "center", }}>Forma de Pago</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText id="contacto" name="contacto" style={{ width: '100%' }} onChange={handleInputChange} value={dataProveedor.contacto} />
                                <label htmlFor="contacto" style={{ textAlign: "center", }}>Contacto</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputMask id="numero_celular" name="numero_celular" style={{ width: '100%' }} mask="+51 999-999-999" onChange={handleInputChange} value={dataProveedor.numero_celular} />
                                <label htmlFor="numero_celular" style={{ textAlign: "center", }}>Número Celular</label>
                            </FloatLabel>
                        </div>
                    </div>
                </form>
            </Dialog >
        </>
    );
};

export default ModalCrearProveedor;