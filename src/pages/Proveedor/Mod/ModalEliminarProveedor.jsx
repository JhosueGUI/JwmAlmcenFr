import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { DataProveedor } from "../Data/DataProveedor";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
const ModalEliminarProveedor = ({ pasarAbrirModalEliminar, pasarCerrarModalEliminar, pasarSetProveedor, pasarProveedorSeleccionado }) => {
    //obtenerToken
    const {obtenerToken}=useContext(AuthContext)
    //#region para capturar la data inicial
    const [dataProveedor, setDataProveedor] = useState(DataProveedor)
    const EliminarProveedor = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const respuestaPost = await axios.delete(`https://jwmalmcenb-production.up.railway.app/api/almacen/proveedor/delete/${pasarProveedorSeleccionado.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/proveedor/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const ProveedorAdaptado = respuestaGet.data.data.map(item => ({
                    id: item.id || '',
                    razon_social: item.razon_social || '',
                    ruc: item.ruc || '',
                    direccion: item.direccion || '',
                    forma_pago: item.forma_pago || '',
                    contacto: item.contacto || '',
                    numero_celular: item.numero_celular || ''
                }))
                pasarSetProveedor(ProveedorAdaptado)
                const mensajeDelServidor = respuestaPost.data.resp
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                pasarCerrarModalEliminar()
            }
        } catch (error) {
            console.log('Error', error)
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp, life: 3000 });
        }
    }
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Eliminación de Proveedor cancelada', life: 3000 });
    };

    const ConfirmarEliminacion = () => {
        confirmDialog({
            message: '¿Está seguro de eliminar este Proveedor?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: EliminarProveedor,
            reject
        });
    };
    //#region Plasmar los datos del Personal a los Inputs
    useEffect(() => {
        if (pasarProveedorSeleccionado) {
            setDataProveedor({
                ruc: pasarProveedorSeleccionado.ruc || '',
                razon_social: pasarProveedorSeleccionado.razon_social || ''
            })
        }
    }, [pasarProveedorSeleccionado])

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
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Eliminar Proveedor</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalEliminar} />
                </div>}
                visible={pasarAbrirModalEliminar}
                style={{ width: '25%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalEliminar}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <FloatLabel>
                            <InputText id="nombre" style={{ width: '100%' }} value={dataProveedor.ruc} disabled />
                            <label htmlFor="nombre" style={{ textAlign: "center", }}>RUC</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText id="nombre" style={{ width: '100%' }} value={dataProveedor.razon_social} disabled />
                            <label htmlFor="nombre" style={{ textAlign: "center", }}>Proveedor</label>
                        </FloatLabel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ModalEliminarProveedor;