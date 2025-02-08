import styled from "styled-components";
import React, { useState, useEffect } from 'react';
//TABLA REACT PRIME
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
//IMPORTAR AXIOS
import axios from "axios";
//IMPORTAR ARCHIVO DE FILTRADO
import { FiltradoPersonal } from "../Components/FiltradoPersonal";
//MODAL PARA AGREGAR PERSONAL
import ModalAgregarPersonal from "../Mod/ModalCrearPersonal";
//MODAL EDITAR PERSONAL
import ModalEditarPersonal from "../Mod/ModalEditarPersonal";
//IMPORTAR DATA
import { InicialDataPersonal } from '../Data/DataPersonal';
import { Button } from "primereact/button";
import { ModalAsignarRol } from "../Mod/ModalAsignarRol";
import ModalEliminarPersonal from "../Mod/ModalEliminarPersonal";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
//para los menus
import { TabMenu } from 'primereact/tabmenu';
import { ModalEnvioDeCredencial } from "../Mod/ModalEnvioDeCredencial";
import { SubirArchivoPersonal } from "../Components/SubirArchivoPersonal";
import { ExportarPersonal } from "../Components/ExportarPersonal";
import { ProgressSpinner } from 'primereact/progressspinner';

export function PersonalPage() {
    //#region para el cargado
    const [cargando, setCargando] = useState(false);
    //obtener el token
    const { obtenerToken } = useContext(AuthContext)
    //#region Estado para almacenar la lista de personal 
    const [personal, setPersonal] = useState([]);
    // Efecto para cargar los datos iniciales del personal desde la API al montar el componente
    useEffect(() => {
        const obtenerPersonal = async () => {
            try {
                const token = obtenerToken() // Obtenemos el token de localStorage
                if (token) {
                    setCargando(true);
                    const respuesta = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/personal/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const PersonalAdaptado = respuesta.data.data.map(item => ({
                        id: item.id || '',
                        nombre: item.persona?.nombre || '',
                        apellido: `${item.persona?.apellido_paterno} ${item.persona?.apellido_materno}` || '',
                        gmail: item.persona?.gmail || '',
                        numero_documento: item.persona?.numero_documento || '',
                        tipo_documento_id: item.persona?.tipo_documento_id || '',
                        area: item.area?.nombre || '',
                        area_id: item.area?.id || '',
                        habilidad: item.habilidad || '',
                        experiencia: item.experiencia || '',
                    }))
                    setCargando(false);
                    setPersonal(PersonalAdaptado)

                } else {
                    console.log("No se encontró un token de autenticación válido"); // Manejo de caso donde no hay token válido
                    setCargando(false);
                }
            } catch (error) {
                console.error("Error al obtener el personal:", error); // Manejo de errores en la solicitud HTTP
                setCargando(false);
            }
        };
        obtenerPersonal(); // Llamamos a la función para obtener los datos
    }, []); // El efecto se ejecuta solo una vez al montar el componente

    //#region Estado para las columnas visibles en la tabla
    const [columnasVisibles, setColumnasVisibles] = useState(InicialDataPersonal);
    // Función para manejar el cambio de columnas visibles en la tabla
    const manejarCambioColumnas = (evento) => {
        const columnasSeleccionadas = evento.value;
        // Filtramos las columnas visibles basadas en las seleccionadas por el usuario
        const columnasOrdenadasSeleccionadas = InicialDataPersonal.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );

        setColumnasVisibles(columnasOrdenadasSeleccionadas); // Actualizamos el estado de columnas visibles
    };
    //#region  Estado para el filtro de búsqueda
    const [filtro, setFiltro] = useState('');
    // Función para filtrar el personal basado en el filtro de búsqueda
    const personalFiltrado = personal.filter(p => {
        const nombre = p.nombre || '';
        const apellido = p.apellido || '';
        const gmail = p.gmail || '';
        const numeroDocumento = p.numero_documento || '';
        const area = p.area || '';
        const habilidad = p.habilidad || '';
        const experiencia = p.experiencia !== null ? p.experiencia.toString() : '';

        return (
            nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            apellido.toLowerCase().includes(filtro.toLowerCase()) ||
            gmail.toLowerCase().includes(filtro.toLowerCase()) ||
            numeroDocumento.toLowerCase().includes(filtro.toLowerCase()) ||
            area.toLowerCase().includes(filtro.toLowerCase()) ||
            habilidad.toLowerCase().includes(filtro.toLowerCase()) ||
            experiencia.toLowerCase().includes(filtro.toLowerCase())
        );
    });
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
        { label: 'Envío de Credencial', icon: 'pi pi-envelope' }
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
    const botonImportar = <SubirArchivoPersonal pasarSetPersonal={setPersonal} />;


    const asignarRolCampoTabla = (id) => {
        return (
            <div>
                {activeIndex === 0 && (
                    <Button label="Asignar Rol" outlined onClick={() => abrirModalAsignar(id)} />
                )}

                {activeIndex === 1 && (
                    <Button label="Credenciales" outlined onClick={() => funtAbrirModalEnviar(id)} />
                )}
            </div>
        );
    };

    return (
        <Contenedor>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#1A55B0' }}>
                    <div className="TituloE" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{fontSize:'30px', fontWeight:'bold'}}> Gestión de Personal </span>
                        <TabMenu  model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />

                    </div>
                    <div className="ContentE">
                        <span style={{ color: '#1A55B0', fontSize:'15px' }}>
                            En este modulo usteded podra administrar el registro del Personal
                        </span>
                    </div>
                </div>


                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {activeIndex === 0 && (
                        <div className="crearPersonal">
                            <ModalAgregarPersonal pasarSetPersonal={setPersonal} />
                        </div>
                    )}
                    <div className="search">
                        <FiltradoPersonal filtro={filtro} setFiltro={setFiltro} />
                    </div>
                </div>


                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%' }}>
                        <div className="tarjeta" style={{ height: '50%' }}>
                            <DataTable
                                value={personalFiltrado}
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10]}
                                paginatorRight={botonDescargar}
                                paginatorLeft={botonImportar}
                                header={
                                    <MultiSelectContainer>
                                        <MultiSelect
                                            value={columnasVisibles}
                                            options={InicialDataPersonal}
                                            optionLabel="header"
                                            onChange={manejarCambioColumnas}
                                            className="w-full sm:w-20rem"
                                            display="chip"
                                        />
                                    </MultiSelectContainer>
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
                                <Column
                                    header="Acciones"
                                    body={accionesCampoTabla}
                                    style={{ textAlign: 'center', width: '6rem', position: 'sticky', right: 0, background: 'white' }}
                                />
                            </DataTable>

                        </div>
                    </div>
                </div>

            </div>
            {/* RegionModal */}
            <ModalEditarPersonal pasarAbrirModalEditar={ModalEditar} pasarCerrarModalEditar={cerrarModalEditar} pasarPersonalSeleccionado={personalSeleccionado} pasarSetPersonal={setPersonal} />
            <ModalAsignarRol pasarAbrirModalAsignar={ModalAsignar} pasarCerrarModalAsignar={cerrarModalAsignar} pasarPersonalSeleccionado={personalSeleccionado} />
            <ModalEliminarPersonal pasarAbrirModalEliminar={modalEliminarPersonal} pasarCerrarModalEliminar={cerrarModalEliminar} pasarPersonalSeleccionado={personalSeleccionado} pasarSetPersonal={setPersonal} />
            <ModalEnvioDeCredencial pasarAbrirModalEnviar={modalEnviar} pasarCerrarModalEnviar={functCerrarModalEnviar} pasarPersonalSeleccionado={personalSeleccionado} />
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

// Estilo utilizando styled-components para el contenedor principal
const Contenedor = styled.div`
    overflow-y: auto;
`;

const MultiSelectContainer = styled.div`
    .p-multiselect {
        width: 100%; /* Ajusta el tamaño según tus necesidades */
    }
`;