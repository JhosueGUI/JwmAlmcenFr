import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { useContext, useState } from "react";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { DataProveedor } from "../data/DataProveedor";
import { InputNumber } from "primereact/inputnumber";
import UsarGetDatosProveedorApi from "../hooks/UsarGetDatosProveedorApi";
import { AuthContext } from "../../../../context/AuthContext";
import UsarCrearProveedor from "../hooks/UsarCrearProveedor";
import { getProveedor } from "../service/ApiMovimiento";

export const ModalCrearProveedor = ({ setDataProveedor }) => {
    //token
    const { obtenerToken } = useContext(AuthContext);
    //hooks
    const { fetchDatosProveedor } = UsarGetDatosProveedorApi();
    const { Crear } = UsarCrearProveedor();
    const [data, setData] = useState(DataProveedor);
    const [modal, setModal] = useState(false);

    const abrirModal = () => {
        setModal(true);
    }

    const cerrarModal = () => {
        setModal(false);
    }
    const TraerDatos = async () => {
        const respuesta = await fetchDatosProveedor(data.ruc);
        if (respuesta) {
            setData({
                ...data,
                razon_social: respuesta.razon_social,
                direccion: respuesta.direccion,
            })
        }
    }
    const Registrar = async () => {
        await Crear(data);
        const token = obtenerToken();
        const respuesta = await getProveedor(token);
        setDataProveedor(respuesta);
        cerrarModal();
    }

    const footer = (
        <div className="botonesFooter" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={cerrarModal} />
            <Button label="Confirmar" icon="pi pi-check" className="p-button-primary" onClick={Registrar} />
        </div>
    );

    return (
        <>
            <Button icon="pi pi-plus" aria-label="Filter" onClick={abrirModal} />
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="header1" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '26px', color: '#3B75F1' }}>Proveedor</label>
                        <label style={{ fontSize: '18px', fontWeight: 'normal' }}>En esta sección usted puede crear su proveedor </label>
                    </div>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={cerrarModal} />
                </div>}
                visible={modal}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModal}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className='ruc' style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="ruc" style={{ color: '#344054' }}>RUC</label>
                            <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
                                <InputNumber
                                    id="ruc"
                                    name='ruc'
                                    style={{ width: "100%" }}
                                    className="w-full"
                                    onChange={(e) => setData({ ...data, ruc: e.value })}
                                    value={data.ruc}
                                    useGrouping={false}
                                />
                                <Button label="Consultar" onClick={TraerDatos} severity="success" style={{ width: '30%' }} outlined />
                            </div>
                        </div>
                        <div className='razon_social' style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="razon_social" style={{ color: '#344054' }}>Razon Social</label>
                            <InputText
                                id="razon_social"
                                name='razon_social'
                                style={{ width: "100%" }}
                                className="w-full"
                                value={data.razon_social}
                                disabled
                            />
                        </div>
                        <div className='direccion' style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="direccion" style={{ color: '#344054' }}>Dirección</label>
                            <InputText
                                id="direccion"
                                name='direccion'
                                style={{ width: "100%" }}
                                className="w-full"
                                value={data.direccion}
                                disabled
                            />
                        </div>

                    </div>
                </div>
            </Dialog>
        </>
    );
};
