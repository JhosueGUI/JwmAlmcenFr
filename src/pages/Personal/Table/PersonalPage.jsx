import styled from "styled-components";
import React, { useState } from 'react';
//TABLA REACT PRIME
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
//IMPORTAR AXIOS
import axios from "axios";
//IMPORTAR ARCHIVO DE FILTRADO
//MODAL PARA AGREGAR PERSONAL
import ModalAgregarPersonal from "../Mod/ModalCrearPersonal";
//MODAL EDITAR PERSONAL
import ModalEditarPersonal from "../Mod/ModalEditarPersonal";
import { Button } from "primereact/button";
import { ModalAsignarRol } from "../Mod/ModalAsignarRol";
import ModalEliminarPersonal from "../Mod/ModalEliminarPersonal";
//para los menus
import { TabMenu } from 'primereact/tabmenu';
import { ModalEnvioDeCredencial } from "../Mod/ModalEnvioDeCredencial";
import { SubirArchivoPersonal } from "../Components/SubirArchivoPersonal";
import { ExportarPersonal } from "../Components/ExportarPersonal";
import { ProgressSpinner } from 'primereact/progressspinner';
import UsarGetPersonal from "../Hooks/UsarGetPersonal";
import { ColumnasPeronal } from "../Constant/ColumnasPersonal";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import UseGetPersonalDisable from "../Hooks/UseGetPersonalDisable";
import ModalActivarPersonal from "../Mod/ModalActivarPersonal";

export function PersonalPage() {
    //hooks
    const { data, setData } = UsarGetPersonal();
    const { personalDisable, setPersonalDisable } = UseGetPersonalDisable();
    //columnas Iniciales
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasPeronal);
    // Estado para la búsqueda global
    const [filtroGlobal, setFiltroGlobal] = useState("");
    // Función para alternar columnas visibles
    const AlternarColumna = (event) => {
        let columnasSeleccionadas = event.value;
        let columnasOrdenadas = ColumnasPeronal.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );
        setColumnasVisibles(columnasOrdenadas);
    }
    // Filtrar los datos en base a la búsqueda
    const datosFiltrados = data?.filter(item =>
        columnasVisibles.some(col =>
            item[col.field]?.toString().toLowerCase().includes(filtroGlobal.toLowerCase())
        )
    );

    //#region para Modal Editar y Modal Eliminar
    //Estados para la seleccion del personal y del modal editar
    const [personalSeleccionado, setPersonalSeleccionado] = useState(null)
    const [ModalEditar, setModalEditar] = useState(false)

    const abrirModalEditar = (idPersonal) => {
        setModalEditar(true)
        setPersonalSeleccionado(idPersonal)
    }
    const cerrarModalEditar = () => {
        setModalEditar(false)
        setPersonalSeleccionado(null)
    }
    //Estados para abrir modal eliminar
    const [modalEliminarPersonal, setModalEliminarPersonal] = useState(false)
    const abrirModalEliminar = (idPersonal) => {
        setModalEliminarPersonal(true)
        setPersonalSeleccionado(idPersonal)
    }
    const cerrarModalEliminar = () => {
        setModalEliminarPersonal(false)
        setPersonalSeleccionado(null)
    }
    //Estados para abrir modal activar
    const [modalActivarPersonal, setModalActivarPersonal] = useState(false)
    const abrirModalActivar = (idPersonal) => {
        setModalActivarPersonal(true)
        setPersonalSeleccionado(idPersonal)
    }
    const cerrarModalActivar = () => {
        setModalActivarPersonal(false)
        setPersonalSeleccionado(null)
    }

    //#region JSX de las acciones para cada fila de la tabla
    const accionesCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar">
                    <Button icon="pi pi-pencil" severity="success" aria-label="Editar" onClick={() => abrirModalEditar(id)} style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }} />
                </div>
                <div className="eliminar">
                    <Button icon="pi pi-trash" severity="danger" aria-label="Eliminar" onClick={() => abrirModalEliminar(id)} style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} />
                </div>
            </div>
        );
    };
    // Estado para la pestaña activa
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: 'Gestión de Personal', icon: 'pi pi-users' },
        { label: 'Envío de Credencial', icon: 'pi pi-envelope' },
        { label: 'Gestión de Usuarios', icon: 'pi pi-spin pi-cog' }
    ];

    //#region Para asignar rol
    const [ModalAsignar, setModalAsignar] = useState(false)
    const abrirModalAsignar = (idPersonal) => {
        setModalAsignar(true)
        setPersonalSeleccionado(idPersonal)
    }

    const cerrarModalAsignar = () => {
        setModalAsignar(false)
        setPersonalSeleccionado(null)
    }
    //Estados para abrir Modal Enviar Credenciales
    const [modalEnviar, setModalEnviar] = useState(false)
    const funtAbrirModalEnviar = (idPersonal) => {
        setModalEnviar(true)
        setPersonalSeleccionado(idPersonal)
    }
    const functCerrarModalEnviar = () => {
        setModalEnviar(false)
    }

    //#region para aumnetar los botones en la tabla
    const botonDescargar = <ExportarPersonal />;
    const botonImportar = <SubirArchivoPersonal pasarSetPersonal={setData} />;


    const asignarRolCampoTabla = (id) => {
        return (
            <div>
                {activeIndex === 0 && (
                    <Button label="Asignar Rol" outlined onClick={() => abrirModalAsignar(id)} />
                )}

                {activeIndex === 1 && (
                    <Button label="Credenciales" outlined onClick={() => funtAbrirModalEnviar(id)} />
                )}
                {activeIndex === 2 && (
                    <Button label="Reactivar" outlined onClick={() => abrirModalActivar(id)} />
                )}
            </div>
        );
    };
    const datosTabla = (activeIndex === 0 || activeIndex === 1) ? datosFiltrados :
        (activeIndex === 2 ? personalDisable : []);
    return (
        <>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#1A55B0' }}>
                    <div className="TituloE" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {(activeIndex === 0 || activeIndex === 1) && (
                            <span style={{ fontSize: '30px', fontWeight: 'bold' }}>Gestión de Personal</span>
                        )}
                        {activeIndex === 2 && (
                            <span style={{ fontSize: '30px', fontWeight: 'bold' }}> Gestión de Usuario </span>
                        )}
                        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />

                    </div>
                    <div className="ContentE">
                        {(activeIndex === 0 || activeIndex === 1) && (
                            <span style={{ color: '#1A55B0', fontSize: '15px' }}>
                                En este modulo usteded podra administrar el registro del Personal
                            </span>
                        )}
                        {activeIndex === 2 && (
                            <span style={{ color: '#1A55B0', fontSize: '15px' }}>
                                En este modulo usteded podra administrar los usuarios del sistema
                            </span>
                        )}
                    </div>
                </div>


                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {activeIndex === 0 && (
                        <div className="crearPersonal">
                            <ModalAgregarPersonal pasarSetPersonal={setData} />
                        </div>
                    )}
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText
                            style={{ backgroundColor: 'var(--clr-primary)', border: 'none' }}
                            value={filtroGlobal}
                            onChange={(e) => setFiltroGlobal(e.target.value)}
                            placeholder="Buscar Personal"
                        />
                    </IconField>

                </div>


                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%' }}>
                        <div className="tarjeta" style={{ height: '50%' }}>
                            <DataTable
                                value={datosTabla}
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10]}
                                paginatorRight={botonDescargar}
                                paginatorLeft={botonImportar}
                                header={
                                    <MultiSelect
                                        value={columnasVisibles}
                                        options={ColumnasPeronal}
                                        optionLabel="header"
                                        onChange={AlternarColumna}
                                        display="chip"
                                        style={{ width: '100%' }}
                                    />
                                }
                                tableStyle={{ minWidth: '50rem' }}
                            >
                                {columnasVisibles.map(col => (
                                    <Column
                                        key={col.field}
                                        field={col.field}
                                        header={col.header}
                                    />
                                ))}
                                <Column
                                    header="Operaciones"
                                    body={asignarRolCampoTabla}
                                    style={{ textAlign: 'center', width: '11rem' }}
                                />
                                {(activeIndex === 0 || activeIndex === 1) && (
                                <Column
                                    header="Acciones"
                                    body={accionesCampoTabla}
                                    style={{ textAlign: 'center', width: '6rem', position: 'sticky', right: 0, background: 'white' }}
                                />
                                )}
                            </DataTable>

                        </div>
                    </div>
                </div>

            </div>
            {/* RegionModal */}
            <ModalEditarPersonal pasarAbrirModalEditar={ModalEditar} pasarCerrarModalEditar={cerrarModalEditar} pasarPersonalSeleccionado={personalSeleccionado} pasarSetPersonal={setData} />
            <ModalAsignarRol pasarAbrirModalAsignar={ModalAsignar} pasarCerrarModalAsignar={cerrarModalAsignar} pasarPersonalSeleccionado={personalSeleccionado} />
            <ModalEliminarPersonal pasarAbrirModalEliminar={modalEliminarPersonal} pasarCerrarModalEliminar={cerrarModalEliminar} pasarPersonalSeleccionado={personalSeleccionado} pasarSetPersonal={setData} pasarSetPersonalDisable={setPersonalDisable} />
            <ModalEnvioDeCredencial pasarAbrirModalEnviar={modalEnviar} pasarCerrarModalEnviar={functCerrarModalEnviar} pasarPersonalSeleccionado={personalSeleccionado} />
            <ModalActivarPersonal pasarAbrirModalActivar={modalActivarPersonal} pasarCerrarModalActivar={cerrarModalActivar} pasarPersonalSeleccionado={personalSeleccionado} pasarSetPersonalDisable={setPersonalDisable} pasarSetPersonal={setData}/>
        </>
    );
}