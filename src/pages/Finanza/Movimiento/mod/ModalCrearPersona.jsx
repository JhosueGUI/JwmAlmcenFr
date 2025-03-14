import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { useContext, useState } from "react";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { DataPersona } from "../data/DataPersona";
import UsarGetDatosPersonaApi from "../hooks/UsarGetDatosPersonaApi";
import UsarCrearPersona from "../hooks/UsarCrearPersona";
import { AuthContext } from "../../../../context/AuthContext";
import { getPersona } from "../service/ApiMovimiento";

export const ModalCrearPersona = ({ setPersona }) => {
    //hooks
    const { FetchDatosPersona } = UsarGetDatosPersonaApi();
    const { Crear } = UsarCrearPersona();
    //token
    const { obtenerToken } = useContext(AuthContext);
    //data
    const [data, setData] = useState(DataPersona);
    const [modal, setModal] = useState(false);

    const abrirModal = () => {
        setModal(true);
    }

    const cerrarModal = () => {
        setModal(false);
    }
    const TraerDatos = async () => {
        const respuesta = await FetchDatosPersona(data.numero_documento);
        if (respuesta) {
            setData({
                ...data,
                nombre: respuesta.nombres,
                apellido_paterno: respuesta.apellidoPaterno,
                apellido_materno: respuesta.apellidoMaterno,
            })
        }

    }


    const Registrar = async () => {
        await Crear(data);
        const token = obtenerToken();
        const respuesta = await getPersona(token);
        setPersona(respuesta);
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
                        <label style={{ fontSize: '26px', color: '#3B75F1' }}>Persona</label>
                        <label style={{ fontSize: '18px', fontWeight: 'normal' }}>En esta sección usted puede crear el personal </label>
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
                        <div className='dni' style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="dni" style={{ color: '#344054' }}>DNI</label>
                            <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
                                <InputMask
                                    mask="99999999"
                                    id="dni"
                                    name='dni'
                                    style={{ width: "100%" }}
                                    className="w-full"
                                    onChange={(e) => setData({ ...data, numero_documento: e.value })}
                                    value={data.numero_documento}
                                />
                                <Button label="Consultar" onClick={TraerDatos} severity="success" style={{ width: '30%' }} outlined />
                            </div>
                        </div>
                        <div className='nombre' style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                            <label htmlFor="nombre" style={{ color: '#344054' }}>Nombre</label>
                            <InputText
                                id="nombre"
                                name='nombre'
                                style={{ width: "100%" }}
                                className="w-full"
                                value={data.nombre}
                                disabled
                            />
                        </div>
                        <div className="apellidos" style={{ display: "flex", gap: "5px", width: "100%" }}>
                            <div className='apellido_paterno' style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                                <label htmlFor="apellido_paterno" style={{ color: '#344054' }}>Apellido Paterno</label>
                                <InputText
                                    id="apellido_paterno"
                                    name='apellido_paterno'
                                    style={{ width: "100%" }}
                                    className="w-full"
                                    value={data.apellido_paterno}
                                    disabled
                                />
                            </div>
                            <div className='apellido_materno' style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%" }}>
                                <label htmlFor="apellido_materno" style={{ color: '#344054' }}>Apellido Materno</label>
                                <InputText
                                    id="apellido_materno"
                                    name='apellido_materno'
                                    style={{ width: "100%" }}
                                    className="w-full"
                                    value={data.apellido_materno}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
