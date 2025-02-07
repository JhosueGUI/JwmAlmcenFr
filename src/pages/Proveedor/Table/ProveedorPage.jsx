import styled from "styled-components";
import React, { useState, useEffect } from 'react';
//TABLA REACT PRIME
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { ColumnasParaMostrarDataProveedor } from "../Data/DataProveedor";
import axios from "axios";
import { FiltradoProveedor } from "../Components/FiltradoProveedor";
import { Button } from "primereact/button";
import ModalCrearProveedor from "../Mod/ModalCrearProveedor";
import ModalEditarProveedor from "../Mod/ModalEditarProveedor";
import ModalEliminarProveedor from "../Mod/ModalEliminarProveedor";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ExportarProveedor } from "../Components/ExportarProveedor";
import { ImportarProveedor } from "../Components/ImportarProveedor";
import { ProgressSpinner } from 'primereact/progressspinner';

export function ProveedorPage() {
     //#region para el cargado
     const [cargando, setCargando] = useState(false);
    //obtener token
    const {obtenerToken}=useContext(AuthContext)
    //#region Estado para las columnas visibles en la tabla
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasParaMostrarDataProveedor)
    // Función para manejar el cambio de columnas visibles en la tabla
    const manejarCambioColumnas = (evento) => {
        const columnasSeleccionadas = evento.value;
        // Filtramos las columnas visibles basadas en las seleccionadas por el usuario
        const columnasOrdenadasSeleccionadas = ColumnasParaMostrarDataProveedor.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        )
        // Actualizamos el estado de columnas visibles
        setColumnasVisibles(columnasOrdenadasSeleccionadas)
    }
    //#region Estado para almacenar la lista de proveedor
    const [proveedor, setProveedor] = useState([])
    // Efecto para cargar los datos iniciales del personal desde la API al montar el componente

    useEffect(() => {
        const TraerProveedor = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    setCargando(true);
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/proveedor/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const ProveedorTransformado = respuestaGet.data.data.map(item => ({
                        id: item.id || '',
                        razon_social: item.razon_social || '',
                        ruc: item.ruc || '',
                        direccion: item.direccion || '',
                        forma_pago: item.forma_pago || '',
                        contacto: item.contacto || '',
                        numero_celular: item.numero_celular || ''
                    }))
                    setCargando(false);
                    setProveedor(ProveedorTransformado)
                }
            } catch (error) {
                console.log("Error al traer Proveedor",error)
                setCargando(false);
            }
        }
        TraerProveedor()
    }, [])
    //#region  Estado para el filtro de búsqueda
    const [filtro, setFiltro] = useState('')
    //funcion para filtrar el Inventario basado en el filtro de busqueda
    const proveedorFiltrado = proveedor.filter(p => {
        const razon_social = p.razon_social || '';
        const ruc = p.ruc || '';
        const direccion = p.direccion || '';
        const forma_pago = p.forma_pago || '';
        const contacto = p.contacto || '';
        const numero_celular = p.numero_celular || '';
        return (
            razon_social.toLowerCase().includes(filtro.toLowerCase()) ||
            ruc.toLowerCase().includes(filtro.toLowerCase()) ||
            direccion.toLowerCase().includes(filtro.toLowerCase()) ||
            forma_pago.toLowerCase().includes(filtro.toLowerCase()) ||
            contacto.toLowerCase().includes(filtro.toLowerCase()) ||
            numero_celular.toLowerCase().includes(filtro.toLowerCase())
        );
    });
    //#region Estado para abrir modal Editar y Eliminar
    //Estado para la seleccion de Proveedor
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null)

    const [modalEditProveedor, setModalEditProveedor] = useState(false)
    const FunctAbrirModalEditarProveedor = (idProveedor) => {
        setModalEditProveedor(true)
        setProveedorSeleccionado(idProveedor)
    }
    const FunctCerrarModalEditarProveedor = () => {
        setModalEditProveedor(false)
    }
    const [modalEliminarProveedor, setModalEliminarProveedor] = useState(false)
    const FuntAbrirModalElimProveedor = (idProveedor) => {
        setModalEliminarProveedor(true)
        setProveedorSeleccionado(idProveedor)
    }
    const FuntCerrarModalElimProveedor = () => {
        setModalEliminarProveedor(false)
    }
    //#region para aumnetar los botones en la tabla
    const botonDescargar = <ExportarProveedor/>;
    const botonImportar = <ImportarProveedor pasarSetProveedor={setProveedor}/>;
    //#region aumentar Acciones a todas las filas
    const accionesCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar">
                    <Button icon="pi pi-pencil"  severity="success" style={{ color:'#248D63',backgroundColor:'#BFF1DF',border:'none'  }} aria-label="Editar" onClick={() => FunctAbrirModalEditarProveedor(id)} />
                </div>
                <div className="eliminar">
                    <Button icon="pi pi-trash" severity="danger" aria-label="Eliminar" style={{ color:'#FF6767',backgroundColor:'#FFECEC',border:'none' }} onClick={() => FuntAbrirModalElimProveedor(id)} />
                </div>
            </div>
        );
    }
    return (
        <Contenedor>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%' , color: '#4a7de9'}}>
                    <h2> Gestión de Proveedor </h2>
                    <span style={{ color: '#4a7de9' }}>
                        En este modulo usteded gestionara a los Proveedores
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ModalCrearProveedor pasarSetProveedor={setProveedor} />
                    <FiltradoProveedor filtro={filtro} setFiltro={setFiltro} />
                </div>
                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%' }}>
                        <div className="tarjeta" style={{ overflowY: 'auto', overflowX: 'auto' }}>
                            <DataTable
                                value={proveedorFiltrado}
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10]}
                                paginatorRight={botonDescargar}
                                paginatorLeft={botonImportar}
                                header={
                                    <MultiSelectContainer>
                                        <MultiSelect
                                            value={columnasVisibles}
                                            options={ColumnasParaMostrarDataProveedor}
                                            optionLabel="header"
                                            onChange={manejarCambioColumnas}
                                            display="chip"
                                        />
                                    </MultiSelectContainer>
                                }
                                tableStyle={{ minWidth: '150rem' }}
                            >
                                {columnasVisibles.map(col => (
                                    <Column
                                        key={col.field}
                                        field={col.field}
                                        header={col.header}
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
            </div>

            {/* Modals */}
            <ModalEditarProveedor
                pasarAbrirModalEditar={modalEditProveedor}
                pasarCerrarModalEditar={FunctCerrarModalEditarProveedor}
                pasarProveedorSeleccionado={proveedorSeleccionado}
                pasarSetProveedor={setProveedor}
            />
            <ModalEliminarProveedor
                pasarAbrirModalEliminar={modalEliminarProveedor}
                pasarCerrarModalEliminar={FuntCerrarModalElimProveedor}
                pasarProveedorSeleccionado={proveedorSeleccionado}
                pasarSetProveedor={setProveedor}
            />
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
