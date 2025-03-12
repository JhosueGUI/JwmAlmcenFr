import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
//Input con Slider
import { Dropdown } from 'primereact/dropdown';
import { DataPersonal } from '../Data/DataPersonal'
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
//importar Axios
import axios from "axios";
import { GetTipoDocumentos } from "../Services/GetTipoDocumentos";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetArea } from "../Services/GetArea";


const ModalAgregarPersonal = ({ pasarAbrirModalEditar, pasarCerrarModalEditar, pasarPersonalSeleccionado, pasarSetPersonal }) => {
    //obtener token
    const { obtenerToken } = useContext(AuthContext)
    //#region Estado para obtener la data inicial
    const [dataPersonal, setDataPersonal] = useState(DataPersonal)

    const editarPersonal = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                const respuestaPersonalPost = await axios.post(`https://jwmalmcenb-production.up.railway.app/api/almacen/personal/update/${pasarPersonalSeleccionado.id}`, dataPersonal, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Obtener las categorías actualizadas después de agregar una nueva categoría
                const respuestaPersonalGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/personal/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const personalTransformado = respuestaPersonalGet.data.data.map(item => ({
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
                const mensajeDelServidor = respuestaPersonalPost.data.resp
                // Mostrar un mensaje de éxito con React Prime
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                pasarCerrarModalEditar();
            } else {
                toast.current.show({ severity: 'info', summary: 'Observación', detail: 'Seleccione un Tipo de Documento', life: 3000 });
            }
        } catch (error) {
            console.error("Error al editar un personal:", error);
            // Mostrar un mensaje de error con React Prime
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.resp || 'Error al editar el personal', life: 3000 });
        }
    };
    //#region Plasmar los datos del Personal a los Inputs
    useEffect(() => {
        if (pasarPersonalSeleccionado) {
            // Separar el apellido completo en apellido paterno y materno
            const [apellidoPaterno, apellidoMaterno] = pasarPersonalSeleccionado.apellido.split(' ');
            setDataPersonal({
                nombre: pasarPersonalSeleccionado.nombre,
                apellido_paterno: apellidoPaterno || '',
                apellido_materno: apellidoMaterno || '',
                gmail: pasarPersonalSeleccionado.gmail,
                numero_documento: pasarPersonalSeleccionado.numero_documento,
                area_id: pasarPersonalSeleccionado.area_id,
                habilidad: pasarPersonalSeleccionado.habilidad,
                experiencia: pasarPersonalSeleccionado.experiencia,
                tipo_documento_id: pasarPersonalSeleccionado.tipo_documento_id || ''
            });
        }
    }, [pasarPersonalSeleccionado])
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
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Edición de personal cancelada', life: 3000 });
    };

    const confirmarEditar = () => {
        confirmDialog({
            message: '¿Está seguro de editar este personal?',
            header: 'Confirmar Edición',
            icon: 'pi pi-exclamation-triangle',
            accept: editarPersonal,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Editar" onClick={confirmarEditar} className="p-button-success" />
            <Button label="Cancelar" onClick={pasarCerrarModalEditar} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Editar Personal</h3>
                    <Button onClick={pasarCerrarModalEditar} icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" />
                </div>}
                visible={pasarAbrirModalEditar}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalEditar}
                closable={false}
            >
                <form onSubmit={editarPersonal}>
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
                                    <GetTipoDocumentos pasarDataPersonal={handleDocumentosChange} personalInicial={pasarPersonalSeleccionado} />
                                </div>
                                <div className="documento" style={{ width: '40%' }}>
                                    <FloatLabel>
                                        <InputText id="numero_documento" name="numero_documento" style={{ width: '100%' }} value={dataPersonal.numero_documento} onChange={handleInputChange} />
                                        <label htmlFor="numero_documento" style={{ textAlign: "center" }}>Número Documento</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <GetArea pasarSetPersonal={handleAreaChange} pasarPersonalInicial={pasarPersonalSeleccionado}/>
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
