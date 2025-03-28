import styled from "styled-components";
import React, { useState } from 'react';
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import ModalIngresoCreate from "../Mod/ModalIngresoCreate";
import ModalIngresoEdit from "../Mod/ModalIngresoEdit";
import { Button } from "primereact/button";
import { ExportarIngreso } from "../Components/ExportarIngreso";
import { ImportarIngreso } from "../Components/ImportarIngreso";
import { ColumnasIngreso } from "../Constant/ColumnasIngreso";
import UseGetIngreso from "../Hooks/UseGetIngreso";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export function IngresoPage() {
    //#region para el cargado
    const [cargando, setCargando] = useState(false);
    //hooks
    const { data, setData } = UseGetIngreso()
    //#region Estado para las columnas visibles en la tabla
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasIngreso)
    // Estado para la búsqueda global
    const [filtroGlobal, setFiltroGlobal] = useState("");
    // Función para alternar columnas visibles
    const AlternarColumna = (event) => {
        let columnasSeleccionadas = event.value;
        let columnasOrdenadas = ColumnasIngreso.filter(col =>
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
    //#region para aumnetar los botones en la tabla
    const botonDescargar = <ExportarIngreso />;
    const botonImportar = <ImportarIngreso pasarSetIngreso={setData} />;
    //#region aumentar Acciones a todas las filas
    const accionesCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar">
                    <Button icon="pi pi-pencil" severity="success" aria-label="Editar" onClick={() => functAbrirModalEditar(id)} style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }} />
                </div>
                <div className="eliminar">
                    <Button icon="pi pi-trash" severity="danger" aria-label="Eliminar" onClick={() => functAbrirModalEliminar(id)} style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} disabled />
                </div>
            </div>
        );
    }
    return (
        <Contenedor>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#1A55B0', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '30px', fontWeight: 'bold' }}> Gestión de Ingresos </span>
                    <span style={{ color: '#1A55B0', fontSize: '15px' }}>
                        En este modulo usteded podra administrar el registro de los Ingresos
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <ModalIngresoCreate pasarSetIngreso={setData} />
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText
                            style={{ backgroundColor: 'var(--clr-primary)', border: 'none' }}
                            value={filtroGlobal}
                            onChange={(e) => setFiltroGlobal(e.target.value)}
                            placeholder="Buscar Salida"
                        />
                    </IconField>
                </div>
                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%', overflow: 'auto' }}>
                        <DataTable
                            paginator rows={10}
                            rowsPerPageOptions={[5, 10]}
                            paginatorRight={botonDescargar}
                            paginatorLeft={botonImportar}
                            value={datosFiltrados}
                            header={
                                    <MultiSelect
                                        value={columnasVisibles}
                                        options={ColumnasIngreso}
                                        optionLabel="header"
                                        onChange={AlternarColumna}
                                        display="chip"
                                        style={{ width: '100%' }}
                                    />
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
                pasarSetIngreso={setData}
                pasarAbrirModalEdit={modalEdit}
                pasarCerrarModalEdit={funtCerrarModalEdit}
                pasarIngresoSeleccionado={ingresoSeleccionado}
            />
            
        </Contenedor>
    );
}

// Estilo utilizando styled-components para el contenedor principal y MultiSelect
const Contenedor = styled.div`
    overflow-y: auto;
    position: sticky;
`;