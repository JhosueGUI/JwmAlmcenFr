import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
//Input con Slider
import { Dropdown } from 'primereact/dropdown';
import { DataPersonal } from '../Data/DataPersonal'
//importar Axios
import axios from "axios";
// Importar ReactPrime Confirmar Dialogo
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { GetTipoDocumentos } from "../Services/GetTipoDocumentos";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetArea } from "../Services/GetArea";

const ModalAgregarPersonal = ({ pasarSetPersonal }) => {
    //obtner tokrn
    const {obtenerToken}=useContext(AuthContext)
    //#region Estado para modal
    const [modal, setModal] = useState(false);
    const abrirModalPersonal = () => {
        setModal(true);
    };

    const cerrarModalPersonal = () => {
        setModal(false);
    };
    //#region Estado para obtener la data inicial
    const [dataPersonal, setDataPersonal] = useState(DataPersonal)
    const agregarCategoria = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                console.log("Datos que se enviarán:", dataPersonal);

                const respuestaCategoria = await axios.post("http://127.0.0.1:8000/api/almacen/personal/create", dataPersonal, {
                    headers: {
                        Authorization: `Bearer ${token}`

                    }
                });
                console.log("Respuesta del servidor:", respuestaCategoria);

                // Obtener las categorías actualizadas después de agregar una nueva categoría
                const respuestaCategorias = await axios.get("http://127.0.0.1:8000/api/almacen/personal/get", {
                    headers: {
                        Authorization: `Bearer ${token}`

                    }
                });
                console.log(respuestaCategorias.data.data)
                const personalTransformado = respuestaCategorias.data.data.map(item => ({
                    id: item.id || '',
                    nombre: item.persona?.nombre || '',
                    apellido: `${item.persona?.apellido_paterno} ${item.persona?.apellido_materno}` || '',
                    gmail: item.persona?.gmail || '',
                    numero_documento: item.persona?.numero_documento || '',
                    tipo_documento_id: item.persona?.tipo_documento_id || '',
                    area: item.area?.nombre || '',
                    area_id:item.area?.id || '',
                    habilidad: item.habilidad || '',
                    experiencia: item.experiencia || '',
                }));
                // Actualizar el estado de las categorías con los datos obtenidos
                pasarSetPersonal(personalTransformado);
                // Restaurar los datos de categoría a su estado inicial
                setDataPersonal(dataPersonal);
                const mensajeDelServidor = respuestaCategoria.data.resp
                // Mostrar un mensaje de éxito
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                // Cerrar el modal después de agregar la categoría
                cerrarModalPersonal();
            }
        } catch (error) {
            console.error("Error al agregar una categoría:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el personal', life: 3000 });
        }
    };
    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataPersonal({
            ...dataPersonal,
            [name]: value.toUpperCase()
        });
    };
    // Manejar cambios en los campos del formulario para solo TipoDocumento
    const handleDocumentosChange = (tipoDocumentoSeleccionado) => {
        setDataPersonal({
            ...dataPersonal,
            tipo_documento_id: tipoDocumentoSeleccionado.id
        });
    };
     // Manejar cambios en los campos del formulario para solo TipoDocumento
     const handleAreaChange = (areaSeleccionado) => {
        setDataPersonal({
            ...dataPersonal,
            area_id: areaSeleccionado.id
        });
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Creación de personal cancelada', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de crear este personal?',
            header: 'Confirmar Edición',
            icon: 'pi pi-exclamation-triangle',
            accept: agregarCategoria,
            reject
        });
    };

    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarCreacion} className="p-button-success" />
            <Button label="Cancelar" onClick={cerrarModalPersonal} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Button icon="pi pi-plus" label="Agregar Personal" severity="info" outlined  style={{ color:'#4a7de9' }} onClick={abrirModalPersonal} />
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Crear Personal</h3>
                    <Button onClick={cerrarModalPersonal} icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" />
                </div>}
                visible={modal}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModalPersonal}
                closable={false}
            >
                <form onSubmit={agregarCategoria}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <FloatLabel>
                                <InputText id="nombre" name="nombre" style={{ width: '100%' }} value={dataPersonal.nombre} onChange={handleInputChange} />
                                <label htmlFor="nombre" style={{ textAlign: "center", }}>Nombre Completo</label>
                            </FloatLabel>
                            <div className="apellidos" style={{ display: 'flex', justifyContent: 'space-between', gap: '5px', width: '100%' }}>
                                <div style={{ width: '50%' }}>
                                    <FloatLabel>
                                        <InputText id="apellido_paterno" name="apellido_paterno" style={{ width: '100%' }} value={dataPersonal.apellido_paterno} onChange={handleInputChange} />
                                        <label htmlFor="apellido_paterno" style={{ textAlign: "center" }}>Apellido Paterno</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '50%' }}>
                                    <FloatLabel>
                                        <InputText id="apellido_materno" name="apellido_materno" style={{ width: '100%' }} value={dataPersonal.apellido_materno} onChange={handleInputChange} />
                                        <label htmlFor="apellido_materno" style={{ textAlign: "center" }}>Apellido Materno</label>
                                    </FloatLabel>
                                </div>
                            </div>

                            <FloatLabel>
                                <InputText id="gmail" name="gmail" style={{ width: '100%' }} value={dataPersonal.gmail} onChange={handleInputChange} />
                                <label htmlFor="gmail" style={{ textAlign: "center" }}>Gmail</label>
                            </FloatLabel>
                            <div className="documentos" style={{ display: 'flex', gap: '5px' }}>
                                <div className="documento" style={{ width: '60%' }}>
                                    <GetTipoDocumentos pasarDataPersonal={handleDocumentosChange} />
                                </div>
                                <div className="documento" style={{ width: '50%' }}>
                                    <FloatLabel>
                                        <InputText id="numero_documento" name="numero_documento" style={{ width: '100%' }} value={dataPersonal.numero_documento} onChange={handleInputChange} />
                                        <label htmlFor="numero_documento" style={{ textAlign: "center" }}>Número Documento</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <GetArea pasarSetPersonal={handleAreaChange}/>
                            <FloatLabel>
                                <InputText id="habilidad" name="habilidad" style={{ width: '100%' }} value={dataPersonal.habilidad} onChange={handleInputChange} />
                                <label htmlFor="habilidad" style={{ textAlign: "center" }} >Habilidad</label>
                            </FloatLabel>
                            <FloatLabel>
                                <InputText id="experiencia" name="experiencia" style={{ width: '100%' }} value={dataPersonal.experiencia} onChange={handleInputChange} />
                                <label htmlFor="experiencia" style={{ textAlign: "center" }} >Experiencia</label>
                            </FloatLabel>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
};
export default ModalAgregarPersonal;
