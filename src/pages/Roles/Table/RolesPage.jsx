import styled from "styled-components";
import React, { useState, useEffect, useContext } from 'react';
import { ColumnasInicialesRoles } from "../Data/DataRoles";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { Button } from "primereact/button";
import { ModalCrearRol } from "../Mod/ModalCrearRol";
import { ModalEditarRol } from "../Mod/ModalEditarRol";
import { ModalEliminarRol } from "../Mod/ModalEliminarRol";
import { ModalAsignarAccesos } from "../Mod/ModalAsignarAccesos";
import { reporte } from "../../../utils/images";
import { TbLockAccess } from "react-icons/tb";
import { ProgressSpinner } from 'primereact/progressspinner';

export function RolesPage() {
    //#region para el cargado
    const [cargando, setCargando] = useState(false);
    //obtener token
    const { obtenerToken } = useContext(AuthContext)
    //#region columnas iniciales
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasInicialesRoles)
    const manejarCambioColumnas = (e) => {
        const columnasSeleccionadas = e.value;
        const columnasOrdenadasSeleccionadas = ColumnasInicialesRoles.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );
        setColumnasVisibles(columnasOrdenadasSeleccionadas);
    };
    //traer a los roles
    const [roles, setRoles] = useState([])
    useEffect(() => {
        const ObtenerRoles = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    setCargando(true);
                    const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/rol/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    setCargando(false);
                    setRoles(respuestaGet.data.data)
                }
            } catch (error) {
                console.log('Error',error)
                setCargando(false);
            }
        }
        ObtenerRoles()
    }, [])

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
            <Button label='Accesos' style={{ background:'rgb(34, 197, 94)',border:'1px solid #22c55e',color:'white',gap:'10px' }} severity="succes" outlined aria-label="Eliminar" onClick={() => funtAbrirModalAsignar(id)} > <TbLockAccess size={25}/> </Button>
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
        <Contenedor>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#4a7de9' }}>
                    <h2> Gestión de Roles </h2>
                    <span style={{ color: '#4a7de9' }}>
                        En este modulo usteded podra gestionar los Accesos a los Roles
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ModalCrearRol pasarSetRol={setRoles} />
                </div>
                <div className="general" style={{ display: 'flex',width: '100%',gap:'50px'}}>
                    <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div className="tabla-contenedor" style={{ width: '100%' }}>
                            <DataTable
                            paginator rows={10}
                            rowsPerPageOptions={[5, 10]}
                                value={roles}
                                header={
                                    <MultiSelectContainer>
                                        <MultiSelect
                                            value={columnasVisibles}
                                            options={ColumnasInicialesRoles}
                                            optionLabel="header"
                                            onChange={manejarCambioColumnas}
                                            display="chip"
                                        />
                                    </MultiSelectContainer>
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
                                    style={{ textAlign: 'center', width: '10rem', position: 'sticky', right: 0, background: 'white' }}
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
            <ModalEditarRol pasarAbrirModalEdit={modalEditar} pasarCerrarModalEdit={functCerrarModalEdit} pasarRolSeleccionado={rolSeleccionado} pasarSetRol={setRoles} />
            <ModalEliminarRol pasarAbrirModalEliminar={modalEliminar} pasarCerrarModalEliminar={functCerrarModalDelete} pasarRolSeleccionado={rolSeleccionado} pasarSetRol={setRoles} />
            <ModalAsignarAccesos pasarAbrirModalAsignar={modalAsignar} pasarCerrarModalAsignar={funtCerrarModalAsignar} pasarRolSeleccionado={rolSeleccionado} />
            {/* Mostrar el spinner si está cargando */}
            {cargando && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 10000 // Asegurarse de que esté encima del modal
                }}>
                    <ProgressSpinner className="custom-progress-spinner" style={{ width: '80px', height: '80px', color: 'red' }} strokeWidth="5" fill="var(--surface-ground)" animationDuration=".8s" />
                </div>
            )}
        </Contenedor>
    );
}

const Contenedor = styled.div`
    overflow-y: auto;
`;

const MultiSelectContainer = styled.div`
    .p-multiselect {
        width: 100%; /* Ajusta el tamaño según tus necesidades */
    }
`;