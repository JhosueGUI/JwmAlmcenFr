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
import { SeleccionarPlanilla } from "../Components/SeleccionarPlanilla";
import { SeleccionarCargo } from "../Components/SeleccionarCargo";
import { Calendar } from 'primereact/calendar';

const ModalAgregarPersonal = ({ pasarSetPersonal }) => {
    //obtner tokrn
    const { obtenerToken } = useContext(AuthContext)
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
                const respuestaCategoria = await axios.post("https://jwmalmcenb-production.up.railway.app/api/almacen/personal/create", dataPersonal, {
                    headers: {
                        Authorization: `Bearer ${token}`

                    }
                });
                // Obtener las categorías actualizadas después de agregar una nueva categoría
                const respuestaCategorias = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/personal/get", {
                    headers: {
                        Authorization: `Bearer ${token}`

                    }
                });
                const personalTransformado = respuestaCategorias.data.data.map(item => ({
                    id: item.id || '',
                    nombre: item.persona?.nombre || '',
                    fecha_nacimiento: item.persona?.fecha_nacimiento || '',
                    apellido: `${item.persona?.apellido_paterno} ${item.persona?.apellido_materno}` || '',
                    gmail: item.persona?.gmail || '',
                    numero_documento: item.persona?.numero_documento || '',
                    tipo_documento_id: item.persona?.tipo_documento_id || '',
                    fecha_ingreso: item.fecha_ingreso || '',
                    area: item.cargo.area?.nombre || '',
                    cargo: item.cargo?.nombre_cargo || '',
                    area_id: item.area?.id || '',
                    habilidad: item.habilidad || '',
                    ingreso_planilla: item.fecha_ingreso_planilla || '',
                    planilla: item.planilla?.nombre_planilla || '',
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
    //Funciones para eventos
    const handleDocumentosChange = (tipoDocumentoSeleccionado) => {
        setDataPersonal({
            ...dataPersonal,
            tipo_documento_id: tipoDocumentoSeleccionado.id
        });
    };
    const handlePlanillaChange = (e) => {
        setDataPersonal({
            ...dataPersonal,
            planilla_id: e.value.id
        });
    }

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
            <Button icon="pi pi-plus" label="Agregar Personal" severity="info" outlined style={{ color: '#1A55B0' }} onClick={abrirModalPersonal} />
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Crear Personal</h3>
                    <Button onClick={cerrarModalPersonal} icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" />
                </div>}
                visible={modal}
                style={{ width: '40%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModalPersonal}
                closable={false}
            >
                <form onSubmit={agregarCategoria}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div className="apellidos" style={{ display: 'flex', justifyContent: 'space-between', gap: '5px', width: '100%' }}>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="nombre" name="nombre" style={{ width: '100%' }} value={dataPersonal.nombre} onChange={handleInputChange} />
                                        <label htmlFor="nombre" style={{ textAlign: "center", }}>Nombre Completo</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="apellido_paterno" name="apellido_paterno" style={{ width: '100%' }} value={dataPersonal.apellido_paterno} onChange={handleInputChange} />
                                        <label htmlFor="apellido_paterno" style={{ textAlign: "center" }}>Apellido Paterno</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="apellido_materno" name="apellido_materno" style={{ width: '100%' }} value={dataPersonal.apellido_materno} onChange={handleInputChange} />
                                        <label htmlFor="apellido_materno" style={{ textAlign: "center" }}>Apellido Materno</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fecha_nacimiento" value={dataPersonal.fecha_nacimiento} onChange={(e) => setDataPersonal({ ...dataPersonal, fecha_nacimiento: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: "100%" }} />
                                        <label htmlFor="fecha_nacimiento" style={{ textAlign: "center" }}>Fecha Nacimiento</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div className="documentos" style={{ display: 'flex', gap: '5px' }}>
                                <div className="gmail" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="gmail" name="gmail" style={{ width: '100%' }} value={dataPersonal.gmail} onChange={handleInputChange} />
                                        <label htmlFor="gmail" style={{ textAlign: "center" }}>Gmail</label>
                                    </FloatLabel>
                                </div>
                                <div className="documento" style={{ width: '100%' }}>
                                    <GetTipoDocumentos pasarDataPersonal={handleDocumentosChange} />
                                </div>
                                <div className="documento" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="numero_documento" name="numero_documento" style={{ width: '100%' }} value={dataPersonal.numero_documento} onChange={handleInputChange} />
                                        <label htmlFor="numero_documento" style={{ textAlign: "center" }}>Número Documento</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <SeleccionarCargo />
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fecha_ingreso" value={dataPersonal.fecha_ingreso} onChange={(e) => setDataPersonal({ ...dataPersonal, fecha_ingreso: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: "100%" }} />
                                        <label htmlFor="fecha_ingreso" style={{ textAlign: "center" }}>Fecha Ingreso</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <SeleccionarPlanilla pasarSetPersonal={handlePlanillaChange}/>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fecha_ingreso_planilla" value={dataPersonal.fecha_ingreso_planilla} onChange={(e) => setDataPersonal({ ...dataPersonal, fecha_ingreso_planilla: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: "100%" }} />
                                        <label htmlFor="fecha_ingreso_planilla" style={{ textAlign: "center" }}>Fecha Ingreso Planilla</label>
                                    </FloatLabel>
                                </div>
                            </div>

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
