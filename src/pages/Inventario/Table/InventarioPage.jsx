import styled from "styled-components";
import React, { useState } from 'react';
//TABLA REACT PRIME
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';

import { FiltradoInventario } from "../Components/FiltradoInventario";
import ModalCrearInventario from "../Mod/ModalCrearInventario";
import { Button } from "primereact/button";
import ModalEliminarInventario from "../Mod/ModalEliminarInventario";
import "../../../Css/Drop.css";
import { ImportarInventario } from "../Components/ImportarInventario";
import { ExportarInventario } from "../Components/ExportarInventario";
import { ModalEditarInventario } from "../Mod/ModalEditarInventario";
import UsarGetInventario from "../Hooks/UsarGetInventario";
import { ColumnasInventario } from "../Constants/ColumnasInventario";

export function InventarioPage() {
    //hooks
    const { data, setData } = UsarGetInventario()
    //#region Estado para las columnas visibles en la tabla
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasInventario);
    // Estado para la búsqueda global
    const [filtroGlobal, setFiltroGlobal] = useState("");
    // Función para alternar columnas visibles
    const AlternarColumna = (event) => {
        let columnasSeleccionadas = event.value;
        let columnasOrdenadas = ColumnasInventario.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );
        setColumnasVisibles(columnasOrdenadas);
    };
    // Filtrar los datos en base a la búsqueda
    const datosFiltrados = data?.filter(item =>
        columnasVisibles.some(col =>
            item[col.field]?.toString().toLowerCase().includes(filtroGlobal.toLowerCase())
        )
    );

    //#region Estado para abrir modal Editar y Eliminar
    const [inventarioSeleccionado, setInventarioSeleccionado] = useState(null)
    const [modalEditar, setModalEditar] = useState(false)
    const abrirModalEditarInventario = (idInventario) => {
        setModalEditar(true)
        setInventarioSeleccionado(idInventario)
    }
    const cerrarModalEditarInventario = () => {
        setModalEditar(false)
    }
    const [modalEliminar, setModalEliminar] = useState(false)
    const abrirModalEliminarInventario = (idInventario) => {
        setModalEliminar(true)
        setInventarioSeleccionado(idInventario)
    }
    const cerrarModalEliminarInventario = () => {
        setModalEliminar(false)
    }
    //#region para aumnetar los botones en la tabla
    const botonDescargar = <ExportarInventario />;
    const botonImportar = <ImportarInventario pasarSetInventario={setData} />;

    //#region aumentar Acciones a todas las filas
    const accionesCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar">
                    <Button icon="pi pi-pencil" severity="success" style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }} aria-label="Editar" onClick={() => abrirModalEditarInventario(id)} />
                </div>
                <div className="eliminar">
                    <Button icon="pi pi-trash" severity="danger" style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} aria-label="Eliminar" onClick={() => abrirModalEliminarInventario(id)} disabled />
                </div>
            </div>
        );
    }

    //#region para formatear los precios
    const formatearPrecioSoles = (precio) => {
        return `S/. ${parseFloat(precio).toFixed(2)}`;
    };

    const formatearPrecioDolares = (precio) => {
        return `$/. ${parseFloat(precio).toFixed(2)}`;
    };
    return (
        <Contenedor>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#1A55B0', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '30px', fontWeight: 'bold' }} > Gestión de Inventario </span>
                    <span style={{ color: '#1A55B0', fontSize: '15px' }}>
                        En este modulo usteded podra administrar los el inventario
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="crearInventario">
                        <ModalCrearInventario pasarSetInventario={setData} />
                    </div>
                    <div className="search">
                        <FiltradoInventario filtro={filtroGlobal} setFiltro={setFiltroGlobal} />
                    </div>
                </div>
                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%' }}>
                        <div className="tarjeta" style={{ overflowY: 'auto', overflowX: 'auto' }}>
                            <DataTable
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10, 20]}
                                paginatorRight={botonDescargar}
                                paginatorLeft={botonImportar}
                                value={datosFiltrados}
                                header={
                                        <MultiSelect
                                            value={columnasVisibles}
                                            options={ColumnasInventario}
                                            optionLabel="header"
                                            onChange={AlternarColumna}
                                            display="chip"
                                            style={{ width: '100%' }}
                                        />
                                }
                                tableStyle={{ minWidth: '250rem' }}
                            >
                                {columnasVisibles.map(col => {
                                    if (col.field === 'precio_unitario_soles' || col.field === 'valor_inventario_soles' || col.field === 'precio_soles') {
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
                                    } else if (col.field === 'precio_unitario_dolares' || col.field === 'valor_inventario_dolares' || col.field === 'precio_dolares') {
                                        return (
                                            <Column
                                                key={col.field}
                                                field={col.field}
                                                header={col.header}
                                                body={(rowData) => (
                                                    <div style={{
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
                                                    }}>
                                                        {formatearPrecioDolares(rowData[col.field])}
                                                    </div>
                                                )}
                                            />
                                        );
                                    } if (col.field === 'estado_operativo') {
                                        return (
                                            <Column
                                                key={col.field}
                                                field={col.field}
                                                header={col.header}
                                                body={(rowData) => (
                                                    <span className={rowData[col.field] === 'Operativo' ? 'estado-operativo-verde' : rowData[col.field] === 'Inmovilizado' ? 'estado-operativo-rojo' : ''}>
                                                        {rowData[col.field]}
                                                    </span>
                                                )}
                                            />
                                        );
                                    }
                                    else {
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
                                    header={"Acciones"}
                                    body={accionesCampoTabla}
                                    style={{ textAlign: 'center', width: '5rem', position: 'sticky', right: 0, background: 'white' }}
                                />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ModalEditarInventario
                pasarCerrarModalEditar={cerrarModalEditarInventario}
                pasarAbrirModalEditar={modalEditar}
                pasarSetInventario={setData}
                pasarInventarioSeleccionado={inventarioSeleccionado} />
            <ModalEliminarInventario
                pasarAbrirModalEliminar={modalEliminar}
                pasarCerrarModalEliminar={cerrarModalEliminarInventario}
                pasarSetInventario={setData}
                pasarInventarioSeleccionado={inventarioSeleccionado}
            />
        </Contenedor>
    );
}

// Estilo utilizando styled-components para el contenedor principal y MultiSelect
const Contenedor = styled.div`
    overflow-y: auto;
`;