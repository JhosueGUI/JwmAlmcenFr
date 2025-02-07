import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { ColumnasInicialesFlota } from "../Data/DataFlota";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";
import { Button } from "primereact/button";
import { ModalCrearFlota } from "../Mod/ModalCrearFlota";
import { ModalEditarFlota } from "../Mod/ModalEditarFlota";
import ModalEliminarFlota from "../Mod/ModalEliminarFlota";
import { FiltradoFlota } from "../Components/FiltradoFlota";
import '../Css/Flota.css';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ImportarFlota } from "../Components/ImportarFlota";
import { ExportarFlota } from "../Components/ExportarFlota";
import { ProgressSpinner } from 'primereact/progressspinner';

export function FlotaPage() {
    //#region para el cargado
    const [cargando, setCargando] = useState(false);
    //obtener token
    const { obtenerToken } = useContext(AuthContext)
    //#region para las columnas visibles de Flota
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasInicialesFlota)
    // Función para manejar el cambio de columnas visibles en la tabla
    const manejarCambioColumnas = (e) => {
        const columnasSeleccionadas = e.value
        // Filtramos las columnas visibles basadas en las seleccionadas por el usuario
        const columnasOrdenadasSeleccionadas = ColumnasInicialesIngreso.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        )
        // Actualizamos el estado de columnas visibles
        setColumnasVisibles(columnasOrdenadasSeleccionadas)
    }
    //#region para traer a la flota
    const [flota, setFlota] = useState([])
    useEffect(() => {
        const ObtenerFlota = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    setCargando(true);
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/flota/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })

                    const FlotaAdaptado = respuestaGet.data.data.map(item => {
                        let conductor = null;

                        if (item.personal && item.personal.persona) {
                            conductor = `${item.personal.persona?.nombre || ''} ${item.personal.persona?.apellido_paterno || ''} ${item.personal.persona?.apellido_materno || ''}`;
                        }
                        return {
                            id: item.id || '',
                            placa: item.placa || '',
                            personalId: item.personal_id || '',
                            conductor: conductor,
                            tipo: item.tipo || '',
                            marca: item.marca || '',
                            modelo: item.modelo || '',
                            empresa: item.empresa || '',
                        };
                    });
                    setCargando(false);
                    setFlota(FlotaAdaptado)

                }
            } catch (error) {
                console.log('error', error)
                setCargando(false);
            }
        }
        ObtenerFlota()
    }, [])
    //#region  Estado para el filtro de búsqueda
    const [filtro, setFiltro] = useState('')
    const flotaFiltrado = flota.filter(p => {
        const placa = p.placa || ''
        const conductor = p.conductor || ''
        const tipo = p.tipo || ''
        const marca = p.marca || ''
        const modelo = p.modelo || ''
        const empresa = p.empresa || ''
        return (
            placa.toLowerCase().includes(filtro.toLowerCase()) ||
            conductor.toLowerCase().includes(filtro.toLowerCase()) ||
            tipo.toLowerCase().includes(filtro.toLowerCase()) ||
            marca.toLowerCase().includes(filtro.toLowerCase()) ||
            modelo.toLowerCase().includes(filtro.toLowerCase()) ||
            empresa.toLowerCase().includes(filtro.toLowerCase())
        )
    })
    //#region para modal eliminar y editar
    const [modalEditarFlota, setModalEditarFlota] = useState(false)
    const [flotaSeleccionado, setFlotaSeleccionado] = useState(null)
    const functEditarFlota = (idFlota) => {
        setModalEditarFlota(true)
        setFlotaSeleccionado(idFlota)
    }
    const functCerrarEditarFlota = () => {
        setModalEditarFlota(false)
    }
    const [modalEliminarFlota, setModalEliminatFlota] = useState(false)
    const functAbrirModalEliminar = (idFlota) => {
        setModalEliminatFlota(true)
        setFlotaSeleccionado(idFlota)
    }
    const functCerrarModalEliminar = () => {
        setModalEliminatFlota(false)
    }
    //#region para aumnetar los botones en la tabla
    const botonDescargar = <ExportarFlota />;
    const botonImportar = <ImportarFlota pasarSetFlota={setFlota} />;
    //#region aumentar Acciones a todas las filas
    const accionesCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar">
                    <Button icon="pi pi-pencil" severity="success" aria-label="Editar" onClick={() => functEditarFlota(id)} style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }} />
                </div>
                <div className="eliminar">
                    <Button icon="pi pi-trash" severity="danger" aria-label="Eliminar" onClick={() => functAbrirModalEliminar(id)} style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} />
                </div>
            </div>
        );
    }
    return (
        <Contenedor>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#4a7de9' }}>
                    <h2> Gestión de Flota </h2>
                    <span style={{ color: '#4a7de9' }}>
                        En este modulo usteded podra gestionar la Flota
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ModalCrearFlota pasarSetFlota={setFlota} />
                    <FiltradoFlota filtro={filtro} setFiltro={setFiltro} />
                </div>
                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%' }}>
                        <DataTable
                            paginator rows={10}
                            rowsPerPageOptions={[5, 10]}
                            paginatorRight={botonDescargar}
                            paginatorLeft={botonImportar}
                            value={flotaFiltrado}
                            header={
                                <MultiSelectContainer >
                                    <MultiSelect

                                        value={columnasVisibles}
                                        options={ColumnasInicialesFlota}
                                        optionLabel="header"
                                        onChange={manejarCambioColumnas}
                                        display="chip"
                                    />
                                </MultiSelectContainer>
                            }
                            tableStyle={{ minWidth: '20rem' }}
                        >
                            {columnasVisibles.map(columnas => (
                                <Column
                                    key={columnas.field}
                                    field={columnas.field}
                                    header={columnas.header}
                                />
                            ))}
                            <Column
                                header={'Acciones'}
                                body={accionesCampoTabla}
                                style={{ textAlign: 'center', width: '5rem', position: 'sticky', right: 0, background: 'white' }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ModalEditarFlota pasarAbrirModal={modalEditarFlota} pasarCerrarModal={functCerrarEditarFlota} pasarFlotaSeleccionado={flotaSeleccionado} pasarSetFlota={setFlota} />
            <ModalEliminarFlota pasarAbrirModalEliminar={modalEliminarFlota} pasarCerrarModalEliminar={functCerrarModalEliminar} pasarFlotaSeleccionado={flotaSeleccionado} pasarSetFlota={setFlota} />
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

// Estilo utilizando styled-components para el contenedor principal y MultiSelect
const Contenedor = styled.div`
    overflow-y: auto;
`;

const MultiSelectContainer = styled.div`
    .p-multiselect {
        width: 100%; /* Ajusta el tamaño según tus necesidades */
    }
`;