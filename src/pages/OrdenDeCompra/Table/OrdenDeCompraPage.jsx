import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { ModalCrearOrdenCompra } from "../Mod/CrearOrdenCompra";
import { ColumnasInicialesOrden } from "../Data/DataOrdenCompra";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import axios from "axios";
import { Button } from "primereact/button";
import { DescargarPdf } from "../Components/DescargarPdf";
import { VerPdf } from "../Components/VerPdf";
import { FiltradoOrdenCompra } from "../Components/FiltradoOrdenCompra";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { EditarOrdenCompra } from "../Mod/EditarOrdenCompra";
import { ProgressSpinner } from 'primereact/progressspinner';

export function OrdenDeCompra() {
    //#region para el cargado
    const [cargando, setCargando] = useState(false);
    //obtner token
    const { obtenerToken } = useContext(AuthContext)
    //#region para traer a las ordenes
    const [orden, setOrden] = useState([])
    const [ordenSeleccionado, setOrdenSeleccionado] = useState(null)

    useEffect(() => {
        const TraerOrdenes = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    setCargando(true);
                    const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/orden_compra/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const OrdenAdaptado = respuestaGet.data.data.map(item => ({
                        id: item.id || '',
                        fecha: item.fecha || '',
                        numero_compra: item.numero_orden || '',
                        proveedor: item.proveedor?.razon_social || '',
                        proveedor_id: item.proveedor_id || '',
                        url_pdf: item.url_pdf || '',
                        requerimiento: item.requerimiento || '',
                        gestor_compra:item.gestor_compra || '',
                        solicitante: item.solicitante || '',
                        detalle: item.detalle || '',
                        cotizacion: item.cotizacion || '',
                        productos: item.orden_producto || []
                    }))
                    setCargando(false);
                    setOrden(OrdenAdaptado)

                }
            } catch (error) {
                console.log("Error al traer Orden", error)
                setCargando(false);
            }
        }
        TraerOrdenes()
    }, [])
    //#region para las columnas visibles
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasInicialesOrden)
    // Función para manejar el cambio de columnas visibles en la tabla
    const manejarCambioColumnas = (e) => {
        const columnasSeleccionadas = e.value;
        const columnasOrdenadasSeleccionadas = ColumnasInicialesOrden.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );
        setColumnasVisibles(columnasOrdenadasSeleccionadas);
    };
    //#region para filtrado
    const [filtro, setFiltro] = useState('')

    const OrdenFiltrado = orden.filter(p => {
        const fecha = p.fecha || ''
        const numero_compra = p.numero_compra || ''
        const proveedor = p.proveedor || ''
        return (
            fecha.toLowerCase().includes(filtro.toLowerCase()) ||
            numero_compra.toLowerCase().includes(filtro.toLowerCase()) ||
            proveedor.toLowerCase().includes(filtro.toLowerCase())
        )
    })

    //#region para aumentar mas columnas
    const asignarRolCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <DescargarPdf numeroCompra={id.numero_compra} />
                <VerPdf numeroCompra={id.numero_compra} />
            </div>
        );
    };
    //#region para el modal editar
    const [modalEditar, setModalEditar] = useState(false)
    const abrirModalEditarOrden = (id) => {
        setModalEditar(true)
        setOrdenSeleccionado(id)
    }
    const cerrarModalEditarOrden = () => {
        setModalEditar(false)
    }
    //Columna Para Acciones
    const accionesCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar">
                    <Button icon="pi pi-pencil" severity="success" style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }} aria-label="Editar" onClick={() => abrirModalEditarOrden(id)} />
                </div>
                <div className="eliminar">
                    <Button icon="pi pi-trash" severity="danger" style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} aria-label="Eliminar" onClick={() => abrirModalEliminarInventario(id)} disabled/>
                </div>
            </div>
        );
    };
    return (
        <Contenedor>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#4a7de9' }}>
                    <h2> Orden de Compra </h2>
                    <span style={{ color: '#4a7de9' }}>
                        En este modulo usteded podra gestionar la Orden de Compra
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ModalCrearOrdenCompra pasarSetOrden={setOrden} />
                    <FiltradoOrdenCompra filtro={filtro} setFiltro={setFiltro} />
                </div>
                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%' }}>
                        <DataTable
                            paginator rows={10}
                            rowsPerPageOptions={[5, 10]}
                            value={OrdenFiltrado}
                            header={
                                <MultiSelectContainer>
                                    <MultiSelect
                                        value={columnasVisibles}
                                        options={ColumnasInicialesOrden}
                                        optionLabel="header"
                                        onChange={manejarCambioColumnas}
                                        display="chip"
                                    />
                                </MultiSelectContainer>
                            }
                            tableStyle={{ minWidth: '50rem' }}
                        >
                            {columnasVisibles.map(columnas => (
                                <Column
                                    key={columnas.field}
                                    field={columnas.field}
                                    header={columnas.header}
                                />
                            ))}
                            <Column
                                header="Reportes"
                                body={asignarRolCampoTabla}
                                style={{ textAlign: 'center', width: '10rem', position: 'sticky', right: 0, background: 'white' }}
                            />
                            <Column
                                header="Acciones"
                                body={accionesCampoTabla}
                                style={{ textAlign: 'center', width: '10rem', position: 'sticky', right: 0, background: 'white' }}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditarOrdenCompra pasarAbrirModalEditarOrden={modalEditar} pasarCerrarModalEditarOrden={cerrarModalEditarOrden} pasarOrdenCompraSeleccionado={ordenSeleccionado} pasarSetOrden={setOrden} />
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