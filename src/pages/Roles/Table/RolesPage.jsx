import React, { useState, useEffect, useContext } from 'react';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { ModalCrearRol } from "../Mod/ModalCrearRol";
import { ModalEditarRol } from "../Mod/ModalEditarRol";
import { ModalEliminarRol } from "../Mod/ModalEliminarRol";
import { ModalAsignarAccesos } from "../Mod/ModalAsignarAccesos";
import { reporte } from "../../../utils/images";
import { TbLockAccess } from "react-icons/tb";
import { ColumnsRol } from "../Constant/ColumnsRol";
import UseGetRol from '../Hooks/Rol/UseGetRol';

export function RolesPage() {
    //hooks
    const { rol, setRol } = UseGetRol()
    //#region columnas iniciales
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnsRol)
    const manejarCambioColumnas = (e) => {
        const columnasSeleccionadas = e.value;
        const columnasOrdenadasSeleccionadas = ColumnasInicialesRoles.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );
        setColumnasVisibles(columnasOrdenadasSeleccionadas);
    };


    //#region modal
    const [rolSeleccionado, setRolSeleccionado] = useState(null)

    const [modalEditar, setModalEditar] = useState(false)
    const [modalEliminar, setModalEliminar] = useState(false)

    const functAbrirModalEdit = (idRol) => {
        setModalEditar(true)
        setRolSeleccionado(idRol)
    }
    const functCerrarModalEdit = () => {
        setModalEditar(false)
    }
    const functAbrirModalDelete = (idRol) => {
        setModalEliminar(true)
        setRolSeleccionado(idRol)
    }
    const functCerrarModalDelete = () => {
        setModalEliminar(false)
    }
    const [modalAsignar, setModalAsignar] = useState(false)

    const funtAbrirModalAsignar = (idRol) => {
        setModalAsignar(true)
        setRolSeleccionado(idRol)
    }
    const funtCerrarModalAsignar = () => {
        setModalAsignar(false)
    }
    //#region para aumentar mas columnas
    const asignarAccesoCampoTabla = (id) => {
        return (
            <Button label='Accesos' style={{ background: 'rgb(34, 197, 94)', border: '1px solid #22c55e', color: 'white', gap: '10px' }} severity="succes" outlined aria-label="Eliminar" onClick={() => funtAbrirModalAsignar(id)} > <TbLockAccess size={25} /> </Button>
        );
    };

    const accionesCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar">
                    <Button icon="pi pi-pencil" severity="success" style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }} aria-label="Editar" onClick={() => functAbrirModalEdit(id)} />
                </div>
                <div className="eliminar">
                    <Button icon="pi pi-trash" severity="danger" style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} aria-label="Eliminar" onClick={() => functAbrirModalDelete(id)} />
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#1A55B0', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '30px', fontWeight: 'bold' }}> Gestión de Roles </span>
                    <span style={{ color: '#1A55B0', fontSize: '15px' }}>
                        En este modulo usteded podra gestionar los Accesos a los Roles
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ModalCrearRol pasarSetRol={setRol}/>
                </div>
                <div className="general" style={{ display: 'flex', width: '100%', gap: '50px' }}>
                    <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div className="tabla-contenedor" style={{ width: '100%' }}>
                            <DataTable
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10]}
                                value={rol}
                                header={
                                    <MultiSelect
                                        value={columnasVisibles}
                                        options={ColumnsRol}
                                        optionLabel="header"
                                        onChange={manejarCambioColumnas}
                                        display="chip"
                                        style={{ width: '100%' }}
                                    />
                                }
                                tableStyle={{ minWidth: '10rem' }}
                            >
                                {columnasVisibles.map(columnas => (
                                    <Column
                                        key={columnas.field}
                                        field={columnas.field}
                                        header={columnas.header}
                                    />
                                ))}
                                <Column
                                    header={'Asignar Accesos'}
                                    body={asignarAccesoCampoTabla}
                                    style={{ textAlign: 'center', width: '15rem', position: 'sticky', right: 0, background: 'white' }}
                                />
                                <Column
                                    header={'Acciones'}
                                    body={accionesCampoTabla}
                                    style={{ textAlign: 'center', width: '10rem', position: 'sticky', right: 0, background: 'white' }}
                                />

                            </DataTable>
                        </div>
                    </div>
                    <img src={reporte.roles} alt="profile image" />
                </div>



            </div>

            {/* Modals */}
            <ModalEditarRol pasarAbrirModalEdit={modalEditar} pasarCerrarModalEdit={functCerrarModalEdit} pasarRolSeleccionado={rolSeleccionado} pasarSetRol={setRol} />
            <ModalEliminarRol pasarAbrirModalEliminar={modalEliminar} pasarCerrarModalEliminar={functCerrarModalDelete} pasarRolSeleccionado={rolSeleccionado} pasarSetRol={setRol} />
            <ModalAsignarAccesos pasarAbrirModalAsignar={modalAsignar} pasarCerrarModalAsignar={funtCerrarModalAsignar} pasarRolSeleccionado={rolSeleccionado} />
        </>
    );
}