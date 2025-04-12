import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { useContext, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { getClienteMovimiento } from "../service/ApiMovimiento";
import { DataCliente } from "../data/DataCliente";
import UsarCreateCliente from "../hooks/UsarCreateCliente";
import { AuthContext } from "../../../../context/AuthContext";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
export const ModalCrearCliente = ({ pasarSetData }) => {
    //token
    const { obtenerToken } = useContext(AuthContext);
    //hooks
    const { CrearCliente } = UsarCreateCliente();

    const [data, setData] = useState(DataCliente);

    const [modal, setModal] = useState(false);

    const abrirModal = () => {
        setModal(true);
    }

    const cerrarModal = () => {
        setModal(false);
    }
    const Crear = async () => {
        const responseServer = await CrearCliente(data);
        const token = obtenerToken();
        const respuesta = await getClienteMovimiento(token);
        pasarSetData(respuesta);
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: responseServer, life: 3000 });
        cerrarModal();
    }

    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Creación de Cliente cancelado', life: 3000 });
    };
    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de Crear este cliente?',
            header: 'Confirmar Creación',
            icon: 'pi pi-exclamation-triangle',
            accept: Crear,
            reject
        });
    };

    const footer = (
        <div className="botonesFooter" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={cerrarModal} />
            <Button label="Confirmar" icon="pi pi-check" className="p-button-primary" onClick={confirmarCreacion} />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Button icon="pi pi-plus" aria-label="Filter" onClick={abrirModal} />
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="header1" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '26px', color: '#3B75F1' }}>Cliente</label>
                        <label style={{ fontSize: '18px', fontWeight: 'normal' }}>En esta sección usted puede crear su Cliente </label>
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
                        <label htmlFor="nombre_cliente" style={{ color: '#344054' }}>Nombre Completo</label>
                        <InputText
                            id="nombre_cliente"
                            name='nombre_cliente'
                            value={data.nombre_cliente}
                            onChange={(e) => setData({ ...data, nombre_cliente: e.target.value.toUpperCase() })}
                            type="text"
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};
