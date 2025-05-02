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
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { SeleccionarPlanilla } from "../Components/SeleccionarPlanilla";
import { SeleccionarCargo } from "../Components/SeleccionarCargo";
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import UseCreatePersonal from "../Hooks/UseCreatePersonal";
import { InputNumber } from "primereact/inputnumber";
import { GetPersonal } from "../Services/PersonalApi";
import { GetTipoDocumentos } from "../Services/GetTipoDocumentos";
import UseEditPersonal from "../Hooks/UseEditPersonal";

const ModalEditPersonal = ({ pasarSetPersonal, pasarAbrirModalEditar, pasarCerrarModalEditar, pasarPersonalSeleccionado }) => {
    //hooks
    console.log('pasarPersonalSeleccionado', pasarPersonalSeleccionado)
    const { Edit } = UseEditPersonal()
    const stepperRef = useRef(null);
    //obtner tokrn
    const { obtenerToken } = useContext(AuthContext)
    //#region Estado para obtener la data inicial
    const [dataPersonal, setDataPersonal] = useState(DataPersonal)
    const agregarCategoria = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                console.log('dataPersonal', dataPersonal)
                const responseServer = await Edit(pasarPersonalSeleccionado.id, dataPersonal)
                // Obtener las categorías actualizadas después de agregar una nueva categoría
                const response = await GetPersonal(token)
                // Actualizar el estado de las categorías con los datos obtenidos
                pasarSetPersonal(response);
                // Restaurar los datos de categoría a su estado inicial
                setDataPersonal(dataPersonal);
                // Mostrar un mensaje de éxito
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: responseServer, life: 3000 });
                // Cerrar el modal después de agregar la categoría
                pasarCerrarModalEditar();
            }
        } catch (error) {
            console.error("Error al Editar el personal:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Editar el personal', life: 3000 });
        }
    };
    useEffect(() => {
        if (pasarPersonalSeleccionado) {
            const [apellidoPaterno, apellidoMaterno] = pasarPersonalSeleccionado.apellido.split(' ');

            const convertirFecha = (fechaString) => {
                if (fechaString) {
                    // Ejemplo si la fecha viene en formato 'YYYY-MM-DD'
                    const [year, month, day] = fechaString.split('-');
                    return new Date(year, month - 1, day); // Month is 0-indexed
                }
                return null;
            };

            setDataPersonal({
                nombre: pasarPersonalSeleccionado.nombre || '',
                apellido_paterno: apellidoPaterno || '',
                apellido_materno: apellidoMaterno || '',
                fecha_nacimiento: convertirFecha(pasarPersonalSeleccionado.fecha_nacimiento),
                gmail: pasarPersonalSeleccionado.gmail || '',
                tipo_documento_id: pasarPersonalSeleccionado.tipo_documento_id || '',
                numero_documento: pasarPersonalSeleccionado.numero_documento || '',
                fecha_ingreso: convertirFecha(pasarPersonalSeleccionado.fecha_ingreso),
                fecha_salida: convertirFecha(pasarPersonalSeleccionado.fecha_salida),
                inicio_contrato: convertirFecha(pasarPersonalSeleccionado.inicio_contrato),
                fin_contrato: convertirFecha(pasarPersonalSeleccionado.fin_contrato),
                planilla_id: pasarPersonalSeleccionado.planilla_id || '',
                cargo_id: pasarPersonalSeleccionado.cargo_id || '',
                sueldo_planilla: pasarPersonalSeleccionado.sueldo_planilla || '',
                sueldo_real: pasarPersonalSeleccionado.sueldo_real || '',
                fecha_ingreso_planilla: convertirFecha(pasarPersonalSeleccionado.ingreso_planilla),
                fecha_alta: convertirFecha(pasarPersonalSeleccionado.fecha_alta),
                fecha_baja: convertirFecha(pasarPersonalSeleccionado.fecha_baja),
                habilidad: pasarPersonalSeleccionado.habilidad || '',
                experiencia: pasarPersonalSeleccionado.experiencia || '',
            });
        }
    }, [pasarPersonalSeleccionado]);

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
            planilla_id: e.id
        });
    }
    const handleCargoChange = (e) => {
        setDataPersonal({
            ...dataPersonal,
            cargo_id: e.id
        })
    }

    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Edición de personal cancelada', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de editar este personal?',
            header: 'Confirmar Edición',
            icon: 'pi pi-exclamation-triangle',
            accept: agregarCategoria,
            reject
        });
    };

    const footer = (
        <div>
            <Button label="Editar" onClick={confirmarCreacion} className="p-button-success" />
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
                    <div className="header1" style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '26px', color: '#3B75F1' }}>Editar Personal</label>
                        <label style={{ fontSize: '18px', fontWeight: 'normal' }}>En esta sección usted puede editar los datos del Personal</label>
                        <div className="card">
                        </div>
                    </div>
                    <Button onClick={pasarCerrarModalEditar} icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" />
                </div>}
                visible={pasarAbrirModalEditar}
                style={{ width: '50%', minWidth: '300px', height: '100%' }}
                footer={footer}
                onHide={pasarCerrarModalEditar}
                closable={false}
            >
                <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                    {/* Panel 1: Datos Personales */}
                    <StepperPanel header="Datos Personales">
                        <div className="flex flex-column h-12rem">
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex flex-column justify-content-center align-items-center font-medium p-5 gap-4">
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="nombre" name="nombre" style={{ width: '100%' }} value={dataPersonal.nombre} onChange={handleInputChange} />
                                        <label htmlFor="nombre">Nombre Completo</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="apellido_paterno" name="apellido_paterno" style={{ width: '100%' }} value={dataPersonal.apellido_paterno} onChange={handleInputChange} />
                                        <label htmlFor="apellido_paterno">Apellido Paterno</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="apellido_materno" name="apellido_materno" style={{ width: '100%' }} value={dataPersonal.apellido_materno} onChange={handleInputChange} />
                                        <label htmlFor="apellido_materno">Apellido Materno</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fecha_nacimiento" value={dataPersonal.fecha_nacimiento} onChange={(e) => setDataPersonal({ ...dataPersonal, fecha_nacimiento: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: '100%' }} />
                                        <label htmlFor="fecha_nacimiento">Fecha Nacimiento</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="gmail" name="gmail" style={{ width: '100%' }} value={dataPersonal.gmail} onChange={handleInputChange} />
                                        <label htmlFor="gmail">Gmail</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <GetTipoDocumentos pasarDataPersonal={handleDocumentosChange} />
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="numero_documento" name="numero_documento" style={{ width: '100%' }} value={dataPersonal.numero_documento} onChange={handleInputChange} />
                                        <label htmlFor="numero_documento">Número Documento</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </StepperPanel>


                    {/* Panel 2: Datos Laborales */}
                    <StepperPanel header="Datos Laborales">
                        <div className="flex flex-column h-12rem">
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex flex-column justify-content-center align-items-center font-medium p-5 gap-4">
                                <SeleccionarCargo pasarDataPersonal={handleCargoChange} pasarPersonalSeleccionado={pasarPersonalSeleccionado} />
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fecha_ingreso" value={dataPersonal.fecha_ingreso} onChange={(e) => setDataPersonal({ ...dataPersonal, fecha_ingreso: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: '100%' }} />
                                        <label htmlFor="fecha_ingreso">Fecha Ingreso</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fecha_salida" value={dataPersonal.fecha_salida} onChange={(e) => setDataPersonal({ ...dataPersonal, fecha_salida: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: '100%' }} />
                                        <label htmlFor="fecha_salida">Fecha Salida</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="inicio_contrato" value={dataPersonal.inicio_contrato} onChange={(e) => setDataPersonal({ ...dataPersonal, inicio_contrato: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: '100%' }} />
                                        <label htmlFor="inicio_contrato">Inicio de Contrato</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fin_contrato" value={dataPersonal.fin_contrato} onChange={(e) => setDataPersonal({ ...dataPersonal, fin_contrato: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: '100%' }} />
                                        <label htmlFor="fin_contrato">Fin de Contrato</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} />
                                </div>
                            </div>
                        </div>
                    </StepperPanel>

                    {/* Panel 3: Datos Planilla */}
                    <StepperPanel header="Datos Planilla">
                        <div className="flex flex-column h-12rem">
                            <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex flex-column justify-content-center align-items-center font-medium p-5 gap-4">
                                <SeleccionarPlanilla pasarSetPersonal={handlePlanillaChange} pasarPersonalSeleccionado={pasarPersonalSeleccionado} />
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputNumber
                                            id="sueldo_planilla"
                                            name="sueldo_planilla"
                                            style={{ width: '100%' }}
                                            value={dataPersonal.sueldo_planilla}
                                            onValueChange={(e) => setDataPersonal({ ...dataPersonal, sueldo_planilla: e.value })}
                                            showButtons
                                            buttonLayout="horizontal"
                                            step={0.25}
                                            mode="currency"
                                            currency="PEN"
                                            currencyDisplay="symbol"
                                            locale="es-PE"
                                        />
                                        <label htmlFor="sueldo_planilla" style={{ textAlign: "center", }}>Sueldo Planilla</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputNumber
                                            id="sueldo_real"
                                            name="sueldo_real"
                                            style={{ width: '100%' }}
                                            value={dataPersonal.sueldo_real}
                                            onValueChange={(e) => setDataPersonal({ ...dataPersonal, sueldo_real: e.value })}
                                            showButtons
                                            buttonLayout="horizontal"
                                            step={0.25}
                                            mode="currency"
                                            currency="PEN"
                                            currencyDisplay="symbol"
                                            locale="es-PE"
                                        />
                                        <label htmlFor="sueldo_real" style={{ textAlign: "center", }}>Sueldo Real</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fecha_ingreso_planilla" value={dataPersonal.fecha_ingreso_planilla} onChange={(e) => setDataPersonal({ ...dataPersonal, fecha_ingreso_planilla: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: '100%' }} />
                                        <label htmlFor="fecha_ingreso_planilla">Fecha Ingreso Planilla</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fecha_alta" value={dataPersonal.fecha_alta} onChange={(e) => setDataPersonal({ ...dataPersonal, fecha_alta: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: '100%' }} />
                                        <label htmlFor="fecha_alta">Fecha Alta</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <Calendar id="fecha_baja" value={dataPersonal.fecha_baja} onChange={(e) => setDataPersonal({ ...dataPersonal, fecha_baja: e.value })} dateFormat="dd/mm/yy" showIcon style={{ width: '100%' }} />
                                        <label htmlFor="fecha_baja">Fecha Baja</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="habilidad" name="habilidad" style={{ width: '100%' }} value={dataPersonal.habilidad} onChange={handleInputChange} />
                                        <label htmlFor="habilidad">Habilidad</label>
                                    </FloatLabel>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="experiencia" name="experiencia" style={{ width: '100%' }} value={dataPersonal.experiencia} onChange={handleInputChange} />
                                        <label htmlFor="experiencia">Experiencia</label>
                                    </FloatLabel>
                                </div>
                            </div>
                        </div>
                    </StepperPanel>
                </Stepper>

            </Dialog>
        </>
    );
};
export default ModalEditPersonal;
