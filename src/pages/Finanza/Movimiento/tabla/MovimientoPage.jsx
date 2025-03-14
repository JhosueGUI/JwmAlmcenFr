import React, { useState } from 'react';
import UsarGetMovimiento from '../hooks/UsarGetMovimiento';
import { ColumnasMovimiento } from '../constant/ColumnasMovimiento';
import ModalCrearMovimiento from '../mod/ModalCrearMovimiento';
import ModalTrazabilidadMovimiento from '../mod/ModalTrazabilidadMovimiento';
import ModalEditarMovimiento from '../mod/ModalEditarMovimiento';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { DataTable } from 'primereact/datatable';
import { Column } from "primereact/column";

export function MovimientoPage() {
    // Obtener datos
    const { data, setData } = UsarGetMovimiento();
    // Estado para las columnas visibles
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasMovimiento);

    // Estado para la búsqueda global
    const [filtroGlobal, setFiltroGlobal] = useState("");

    // Función para alternar columnas visibles
    const AlternarColumna = (event) => {
        let columnasSeleccionadas = event.value;
        let columnasOrdenadas = ColumnasMovimiento.filter(col =>
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

    // Abrir Modal Trazabilidad
    const [abrirModalTrazabilidad, setAbrirModalTrazabilidad] = useState(false);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);

    const abrirModal = (id) => {
        setAbrirModalTrazabilidad(true);
        setMovimientoSeleccionado(id);
    }
    const cerrarModal = () => {
        setAbrirModalTrazabilidad(false);
    }
    // Abrir Modal EditarMovimiento
    const [abrirModalEditarMovimiento, setAbrirModalEditarMovimiento] = useState(false);

    const AbrirModalEditar = (id) => {
        setAbrirModalEditarMovimiento(true);
        setMovimientoSeleccionado(id);
    }
    const CerrarModalEditar = () => {
        setAbrirModalEditarMovimiento(false);
    }
    // Columnas Adicionales
    const ColumnasAdicionales = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar">
                    <Button
                        icon="pi pi-pen-to-square"
                        onClick={() => abrirModal(rowData)}
                        severity="success"
                        aria-label="Editar"
                        style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }}
                    />
                </div>
            </div>
        );
    };
    // Columnas Adicionales2
    const ColumnAcciones = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                <div className="editar" style={{ display: 'flex', gap: '5px' }}>
                    <Button
                        icon="pi pi-pencil"
                        onClick={() => AbrirModalEditar(rowData)}
                        severity="success"
                        aria-label="Editar"
                        style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }}
                    />
                    <Button
                        icon="pi pi-trash"
                        onClick={() => AbrirModalEditar(rowData)}
                        severity="danger"
                        aria-label="Editar"
                        style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }}
                        disabled
                    />
                </div>
            </div>
        );
    };
    return (
        <>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#1A55B0', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '30px', fontWeight: 'bold' }}> Gestión Financiera </span>
                    <span style={{ color: '#1A55B0', fontSize: '15px' }}>
                        A continuación, se visualiza la lista de los registro de Movimientos Financieros en el sistema
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="crear" style={{ width: '100%' }}>
                        <ModalCrearMovimiento pasarSetData={setData} />
                    </div>
                    <div className="buscar" style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', }}>
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-search"></i>
                        </span>
                        <InputText
                            value={filtroGlobal}
                            onChange={(e) => setFiltroGlobal(e.target.value)}
                            placeholder="Buscar..."
                        />
                    </div>
                </div>
                <div className="general" style={{ display: 'flex', width: '100%', gap: '50px' }}>
                    <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <div className="tabla-contenedor" style={{ width: '100%' }}>
                            <DataTable
                                value={datosFiltrados}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 20]}
                                header={
                                    <MultiSelect
                                        style={{ width: '100%' }}
                                        value={columnasVisibles}
                                        options={ColumnasMovimiento}
                                        optionLabel="header"
                                        onChange={AlternarColumna}
                                        display="chip"
                                        placeholder="Selecciona columnas"
                                    />
                                }
                            >
                                {columnasVisibles.map(col => (
                                    <Column key={col.field} field={col.field} header={col.header} sortable />
                                ))}
                                <Column
                                    header="Trazabilidad"
                                    body={ColumnasAdicionales}
                                    style={{ textAlign: 'center', width: '5rem', position: 'sticky', right: 0, background: 'white' }}
                                />
                                <Column
                                    header="Acciones"
                                    body={ColumnAcciones}
                                    style={{ textAlign: 'center', width: '5rem', position: 'sticky', right: 0, background: 'white' }}
                                />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
            <ModalTrazabilidadMovimiento pasarAbrirModal={abrirModalTrazabilidad} pasarCerrarModal={cerrarModal} pasarMovimientoSeleccionado={movimientoSeleccionado} />
            <ModalEditarMovimiento pasarAbrirModal={abrirModalEditarMovimiento} pasarCerrarModal={CerrarModalEditar} pasarMovimientoSeleccionado={movimientoSeleccionado} pasarSetData={setData}/>
        </>
    );
}