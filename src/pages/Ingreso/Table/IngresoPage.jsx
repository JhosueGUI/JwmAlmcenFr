import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import { ColumnasInicialesIngreso } from "../Data/IngresoData";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import axios from "axios";
import ModalIngresoCreate from "../Mod/ModalIngresoCreate";
import ModalIngresoEdit from "../Mod/ModalIngresoEdit";
import { Button } from "primereact/button";
import { FiltradoIngreso } from "../Components/FiltradoIngreso";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ExportarIngreso } from "../Components/ExportarIngreso";
import { ImportarIngreso } from "../Components/ImportarIngreso";
import { ProgressSpinner } from 'primereact/progressspinner';

export function IngresoPage() {
    //#region para el cargado
    const [cargando, setCargando] = useState(false);
    //traer token
    const { obtenerToken } = useContext(AuthContext)
    //#region Estado para las columnas visibles en la tabla
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasInicialesIngreso)
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
    //#region Estado para traer la lista de Ingreso
    const [ingreso, setIngreso] = useState([])
    //Efecto para consumir y traer los ingresos
    useEffect(() => {
        const TraerIngresos = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    setCargando(true);
                    const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/ingreso/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    console.log(respuestaGet.data.data)
                    const IngresoAdaptado = respuestaGet.data.data.map(item => {
                        // Acceso directo a transaccion para evitar múltiples accesos anidados
                        const transaccion = item.transaccion || {};
                        const producto = transaccion.producto || {};
                        const articulo = producto.articulo || {};
                        const sub_familia = articulo.sub_familia || {};
                        const familia = sub_familia.familia || {};
                        const proveedor_producto = transaccion.proveedor_producto || {};
                        const proveedor = proveedor_producto.proveedor || {};
                        const inventario = (producto.inventario && producto.inventario) || {};
                        return {
                            id: item.id || '',
                            fecha: item.fecha || '',
                            guia_remision: item.guia_remision || '',
                            tipo_operacion: transaccion.tipo_operacion || '',
                            tipo_cp: item.tipo_cp || '',
                            documento: item.documento || '',
                            orden_compra: item.orden_compra || '',
                            codigo_proveedor: proveedor.id || '',
                            proveedor: proveedor.razon_social || '',
                            SKU: producto.SKU || '',
                            familia: familia.familia || '',
                            sub_familia: sub_familia.nombre || '',
                            articulo: articulo.nombre || '',
                            marca: transaccion.marca || producto.marca || '',
                            precio_dolares: articulo.precio_dolares || 0,
                            precio_soles: articulo.precio_soles || '',
                            stock_logico: inventario.stock_logico || '',
                            unidad_medida: producto.unidad_medida?.nombre || '',
                            ingreso: item.numero_ingreso || '',
                            precio_unitario_soles: transaccion.precio_unitario_soles || '',
                            precio_total_soles: transaccion.precio_total_soles || '',
                            precio_unitario_dolares: transaccion.precio_unitario_dolares || 0,
                            precio_total_dolares: transaccion.precio_total_dolares || '',
                            observaciones: transaccion.observaciones || '',
                        };
                    });
                    setCargando(false);
                    setIngreso(IngresoAdaptado)
                }
            } catch (error) {
                console.log("Error al traer Ingresos", error)
                setCargando(false);
            }
        }
        TraerIngresos()
    }, [])
    //#region  Estado para el filtro de búsqueda
    const [filtro, setFiltro] = useState('')
    //funcion para filtrar el Inventario basado en el filtro de busqueda
    const ingresoFiltrado = ingreso.filter(p => {
        const fecha = p.fecha || '';
        const guia_remision = p.guia_remision || '';
        const tipo_operacion = p.tipo_operacion || '';
        const tipo_cp = p.tipo_cp || '';
        const documento = p.documento || '';
        const orden_compra = p.orden_compra || '';
        const proveedor = p.proveedor || '';
        const SKU = p.SKU || '';
        const familia = p.familia || '';
        const sub_familia = p.sub_familia || '';
        const articulo = p.articulo || '';
        const marca = p.marca || '';
        const stock_logico = p.stock_logico || '';
        const unidad_medida = p.unidad_medida || '';
        const ingreso = p.ingreso || '';
        const precio_total_soles = p.precio_total_soles || 0;
        const precio_total_dolares = p.precio_total_dolares || 0;
        const observaciones = p.observaciones || '';
        return (
            fecha.toLowerCase().includes(filtro.toLowerCase()) ||
            guia_remision.toLowerCase().includes(filtro.toLowerCase()) ||
            tipo_operacion.toLowerCase().includes(filtro.toLowerCase()) ||
            tipo_cp.toLowerCase().includes(filtro.toLowerCase()) ||
            documento.toLowerCase().includes(filtro.toLowerCase()) ||
            orden_compra.toLowerCase().includes(filtro.toLowerCase()) ||
            proveedor.toLowerCase().includes(filtro.toLowerCase()) ||
            SKU.toLowerCase().includes(filtro.toLowerCase()) ||
            familia.toLowerCase().includes(filtro.toLowerCase()) ||
            sub_familia.toLowerCase().includes(filtro.toLowerCase()) ||
            articulo.toLowerCase().includes(filtro.toLowerCase()) ||
            marca.toLowerCase().includes(filtro.toLowerCase()) ||
            stock_logico.toLowerCase().includes(filtro.toLowerCase()) ||
            unidad_medida.toLowerCase().includes(filtro.toLowerCase()) ||
            ingreso.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_total_dolares.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_total_soles.toLowerCase().includes(filtro.toLowerCase()) ||
            observaciones.toLowerCase().includes(filtro.toLowerCase())
        );
    });

    //#region para formatear los precios
    const formatearPrecioSoles = (precio) => {
        return `S/. ${parseFloat(precio).toFixed(2)}`;
    };

    const formatearPrecioDolares = (precio) => {
        return `$/. ${parseFloat(precio).toFixed(2)}`;
    };
    //#region estado para modal Editar y eliminar
    const [modalEdit, setModalEdit] = useState(false)
    const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null)
    //funciones para abrir y cerrar modal editar
    const functAbrirModalEditar = (idIngreso) => {
        setModalEdit(true)
        setIngresoSeleccionado(idIngreso)
    }
    const funtCerrarModalEdit = () => {
        setModalEdit(false)
    }
    //Modal Eliminar
    const [modalEliminar, setModalEliminar] = useState(false)
    const functAbrirModalEliminar = (idIngreso) => {
        setModalEliminar(true)
        setIngresoSeleccionado(idIngreso)
    }
    const funtCerrarModalEliminar = () => {
        setModalEliminar(false)
    }
    //#region para aumnetar los botones en la tabla
    const botonDescargar = <ExportarIngreso />;
    const botonImportar = <ImportarIngreso pasarSetIngreso={setIngreso} />;
    //#region aumentar Acciones a todas las filas
    const accionesCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar">
                    <Button icon="pi pi-pencil" severity="success" aria-label="Editar" onClick={() => functAbrirModalEditar(id)} style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }} />
                </div>
                <div className="eliminar">
                    <Button icon="pi pi-trash" severity="danger" aria-label="Eliminar" onClick={() => functAbrirModalEliminar(id)} style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} disabled/>
                </div>
            </div>
        );
    }
    return (
        <Contenedor>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#4a7de9' }}>
                    <h2> Gestión de Ingresos </h2>
                    <span style={{ color: '#4a7de9' }}>
                        En este modulo usteded podra administrar el registro de los Ingresos
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ModalIngresoCreate pasarSetIngreso={setIngreso} />
                    <FiltradoIngreso filtro={filtro} setFiltro={setFiltro} />
                </div>
                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%', overflow: 'auto' }}>
                        <DataTable
                            paginator rows={10}
                            rowsPerPageOptions={[5, 10]}
                            paginatorRight={botonDescargar}
                            paginatorLeft={botonImportar}
                            value={ingresoFiltrado}
                            header={
                                <MultiSelectContainer>
                                    <MultiSelect
                                        value={columnasVisibles}
                                        options={ColumnasInicialesIngreso}
                                        optionLabel="header"
                                        onChange={manejarCambioColumnas}
                                        display="chip"

                                    />
                                </MultiSelectContainer>
                            }
                            tableStyle={{ minWidth: '260rem' }}
                        >
                            {columnasVisibles.map(col => {
                                if (col.field === 'precio_unitario_soles' || col.field === 'precio_total_soles' || col.field === 'precio_soles') {
                                    return (
                                        <Column
                                            key={col.field}
                                            field={col.field}
                                            header={col.header}
                                            body={(rowData) => (<div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: '#1ea97c',
                                                background: 'rgba(228, 248, 240, 0.7)',
                                                width: '60%',
                                                height: '30px',  // Aumentar la altura a 50px
                                                borderRadius: '5px', // Borde redondeado opcional
                                                margin: 'auto' // Centra el div horizontalmente
                                            }}>{formatearPrecioSoles(rowData[col.field])}</div>)}
                                        />
                                    );
                                } else if (col.field === 'precio_unitario_dolares' || col.field === 'precio_total_dolares' || col.field === 'precio_dolares') {
                                    return (
                                        <Column
                                            key={col.field}
                                            field={col.field}
                                            header={col.header}
                                            body={(rowData) => (<div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: '#3b82f6',
                                                background: 'rgba(219, 234, 254, 0.7)',
                                                width: '60%',
                                                height: '30px',  // Aumentar la altura a 50px
                                                borderRadius: '5px', // Borde redondeado opcional
                                                margin: 'auto' // Centra el div horizontalmente
                                            }}>{formatearPrecioDolares(rowData[col.field])}</div>)}
                                        />
                                    );
                                } else {
                                    return (
                                        <Column
                                            key={col.field}
                                            field={col.field}
                                            header={col.header}
                                        />
                                    );
                                }
                            })}
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
            <ModalIngresoEdit
                pasarSetIngreso={setIngreso}
                pasarAbrirModalEdit={modalEdit}
                pasarCerrarModalEdit={funtCerrarModalEdit}
                pasarIngresoSeleccionado={ingresoSeleccionado}
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
    position: sticky;
`;

const MultiSelectContainer = styled.div`
    .p-multiselect {
        width: 100%; /* Ajusta el tamaño según tus necesidades */
    }
`;