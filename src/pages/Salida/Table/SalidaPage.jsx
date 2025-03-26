import styled from "styled-components";
import React, { useState } from 'react';
import { ColumnasInicialesSalida, ColumnasInicialesSalidaCombustible } from "../Data/SalidaData";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ModalCrearSalida from "../Mod/ModalCrearSalida";
import ModalEditarSalir from "../Mod/ModalEditarSalida";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ExportarSalida } from "../Components/ExportarSalida";
import { ImportarSalida } from "../Components/ImportarSalida";
import { ProgressSpinner } from 'primereact/progressspinner';
import { TabMenu } from "primereact/tabmenu";
import ModalCrearSalidaCombustible from "../Mod/ModalCrearSalidaCombustible";
import ModalEditarSalidaCombustible from "../Mod/ModalEditarSalidaCombustible";
import { ExportarCombustible } from "../Components/ExportarCombustible";
import UsarGetStockCombustible from "../hooks/UsarGetStockCombustible";
import ModalEliminarSalidaCombustible from "../Mod/ModalEliminarSalidaCombustible";
import UsarGetSalidaCombustible from "../hooks/UsarGetSalidaCombustible";
import UsarGetSalida from "../hooks/UsarGetSalida";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

export function SalidaPage() {
    //#hooks
    const { respuesta, setRespuesta } = UsarGetStockCombustible()
    const { data, setData } = UsarGetSalidaCombustible()
    const { data2, setData2 } = UsarGetSalida()

    //#region estado para las columnas visibles
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasInicialesSalida)
    const [columnasVisiblesCombustible, setColumnasVisiblesCombustible] = useState(ColumnasInicialesSalidaCombustible)

    // Estado para la búsqueda global
    const [filtroGlobal, setFiltroGlobal] = useState("");

    // Función para alternar columnas visibles
    const AlternarColumna = (event) => {
        let columnasSeleccionadas = event.value;
        let columnasOrdenadas = ColumnasInicialesSalidaCombustible.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );
        setColumnasVisiblesCombustible(columnasOrdenadas);
    };
    // Función para alternar columnas visibles
    const AlternarColumna2 = (event) => {
        let columnasSeleccionadas = event.value;
        let columnasOrdenadas = ColumnasInicialesSalida.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );
        setColumnasVisibles(columnasOrdenadas);
    };
    // Filtrar los datos en base a la búsqueda
    const datosFiltrados = data?.filter(item =>
        columnasVisiblesCombustible.some(col =>
            item[col.field]?.toString().toLowerCase().includes(filtroGlobal.toLowerCase())
        )
    );
    const datosFiltrados2 = data2?.filter(item =>
        columnasVisibles.some(col =>
            item[col.field]?.toString().toLowerCase().includes(filtroGlobal.toLowerCase())
        )
    );

    //#region para formatear los precios
    const formatearPrecioSoles = (precio) => {
        return `S/. ${parseFloat(precio).toFixed(2)}`;
    }
    const formatearPrecioDolares = (precio) => {
        return `$/. ${parseFloat(precio).toFixed(2)}`;
    };
    //#region estado para abrir y cerrar modal de editar
    const [modalEditarSalir, setModalEditarSalir] = useState(false)
    const [salidaSeleccionado, setSalidaSeleccionado] = useState(null)

    const functAbrirEditar = (idSalir) => {
        setModalEditarSalir(true)
        setSalidaSeleccionado(idSalir)
    }
    const funtCerrarEditar = () => {
        setModalEditarSalir(false)
    }
    //#region estadp para abrir y cerrar modal de editar salida combustible
    const [modalEditarSalidaCombustible, setModalEditarSalidaCombustible] = useState(false)
    const [salidaCombustibleSeleccionado, setSalidaCombustibleSeleccionado] = useState(null)
    const functAbrirEditarCombustible = (idSalir) => {
        setModalEditarSalidaCombustible(true)
        setSalidaCombustibleSeleccionado(idSalir)
    }
    const funtCerrarEditarCombustible = () => {
        setModalEditarSalidaCombustible(false)
    }

    //estado para abrir y cerrar modal de eliminar salida combustible    
    const [modalEliminarSalidaCombustible, setModalEliminarSalidaCombustible] = useState(false)
    const functAbrirEliminarCombustible = (idSalir) => {
        setModalEliminarSalidaCombustible(true)
        setSalidaCombustibleSeleccionado(idSalir)
    }
    const funtCerrarEliminarCombustible = () => {
        setModalEliminarSalidaCombustible(false)
    }
    //

    const botonDescargar = <ExportarSalida />;
    const botonImportar = <ImportarSalida pasarSetSalida={setData2} />;

    const botomExportarCombustible = <ExportarCombustible />
    //#region para aumentar Acciones a todas las filas
    const accionesCampoTabla = (id) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                {activeIndex === 0 && (
                    <div className="editar">
                        <Button icon="pi pi-pencil" severity="success" style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }} aria-label="Editar" onClick={() => { functAbrirEditar(id) }} />
                    </div>
                )}
                {activeIndex === 1 && (
                    <div className="editar">
                        <Button icon="pi pi-pencil" severity="success" style={{ color: '#248D63', backgroundColor: '#BFF1DF', border: 'none' }} aria-label="Editar" onClick={() => { functAbrirEditarCombustible(id) }} />
                    </div>
                )}
                <div className="eliminar">
                    <Button icon="pi pi-trash" severity="danger" style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} aria-label="Eliminar" onClick={() => { functAbrirEliminarCombustible(id) }} />
                </div>
            </div>
        )
    }
    // Estado para la pestaña activa
    const [activeIndex, setActiveIndex] = useState(0);

    const items = [
        { label: 'Salida Inventario', icon: 'pi pi-users' },
        { label: 'Salida Combustible', icon: 'pi pi-envelope' }
    ];
    return (
        <Contenedor>
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#1A55B0' }}>
                    <div className="TituloE" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '30px', fontWeight: 'bold' }}>Gestión de Salidas </span>
                        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    </div>
                    <div className="ContentE">
                        <span style={{ color: '#1A55B0', fontSize: '15px' }}>
                            En este modulo usteded podra administrar el registro de las Salidas
                        </span>
                    </div>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {activeIndex === 0 && (
                        <>
                            <ModalCrearSalida pasarSetSalidas={setData2} />
                            <IconField iconPosition="left">
                                <InputIcon className="pi pi-search" />
                                <InputText
                                    style={{ backgroundColor: 'var(--clr-primary)', border: 'none' }}
                                    value={filtroGlobal}
                                    onChange={(e) => setFiltroGlobal(e.target.value)}
                                    placeholder="Buscar Salida"
                                />
                            </IconField>
                        </>
                    )}
                    {activeIndex === 1 && (

                        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <ModalCrearSalidaCombustible pasarSetSalidas={setData} pasarSetCombustible={setRespuesta} />

                            <Button style={{ fontSize: '17px', background: respuesta.alerta === 'Solicitar Combustible' ? '#FFECEC' : '#BFF1DF', color: respuesta.alerta === 'Solicitar Combustible' ? '#FF6767' : '#248D63', borderColor: respuesta.alerta === 'Solicitar Combustible' ? '#FF6767' : '#248D63' }}>
                                {respuesta.alerta} : {respuesta.stock}
                            </Button>
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
                    )}
                </div>



                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%' }}>
                        {activeIndex === 0 && (
                            <DataTable
                                value={datosFiltrados2}
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10]}
                                paginatorRight={botonDescargar}
                                paginatorLeft={botonImportar}
                                header={
                                    <MultiSelect
                                        style={{ width: '100%' }}
                                        value={columnasVisibles}
                                        options={ColumnasInicialesSalida}
                                        optionLabel="header"
                                        onChange={AlternarColumna2}
                                        display="chip"
                                    />
                                }
                                tableStyle={{ minWidth: '260rem' }}
                            >
                                {columnasVisibles.map(columnas => {
                                    if (columnas.field === 'precio_unitario_soles' || columnas.field === 'precio_total_soles' || columnas.field === 'precio_soles') {
                                        return (
                                            <Column
                                                key={columnas.field}
                                                field={columnas.field}
                                                header={columnas.header}
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
                                                }}>{formatearPrecioSoles(rowData[columnas.field])}</div>)}
                                            />
                                        )
                                    }
                                    else if (columnas.field === 'precio_unitario_dolares' || columnas.field === 'precio_total_dolares' || columnas.field === 'precio_dolares') {
                                        return (
                                            <Column
                                                key={columnas.field}
                                                field={columnas.field}
                                                header={columnas.header}
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
                                                }}>{formatearPrecioDolares(rowData[columnas.field])}</div>)}
                                            />
                                        )
                                    }
                                    else {
                                        return (
                                            <Column
                                                key={columnas.field}
                                                field={columnas.field}
                                                header={columnas.header}
                                            />
                                        )
                                    }
                                })}
                                <Column
                                    header='Acciones'
                                    body={accionesCampoTabla}
                                    style={{ textAlign: 'center', width: '5rem', position: 'sticky', right: 0, background: 'white' }}
                                />

                            </DataTable>
                        )}
                        {activeIndex === 1 && (
                            <DataTable
                                value={datosFiltrados}
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10]}
                                paginatorRight={botomExportarCombustible}
                                paginatorLeft={botonImportar}
                                header={
                                    <MultiSelect
                                        style={{ width: '100%' }}
                                        value={columnasVisiblesCombustible}
                                        options={ColumnasInicialesSalidaCombustible}
                                        optionLabel="header"
                                        onChange={AlternarColumna}
                                        display="chip"
                                    />
                                }
                                tableStyle={{ minWidth: '260rem' }}
                            >
                                {columnasVisiblesCombustible.map(col => {
                                    if (col.field === 'precio_unitario_soles' || col.field === 'precio_total_soles') {
                                        return (
                                            <Column
                                                key={col.field}
                                                field={col.field}
                                                header={col.header}
                                                body={(rowData) => (
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            color: '#1ea97c',
                                                            background: 'rgba(228, 248, 240, 0.7)',
                                                            width: '60%',
                                                            height: '30px', // Altura
                                                            borderRadius: '5px', // Borde redondeado
                                                            margin: 'auto' // Centra horizontalmente
                                                        }}
                                                    >
                                                        {formatearPrecioSoles(rowData[col.field])}
                                                    </div>
                                                )}
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
                                    header='Resultado'
                                    body={(rowData) => {
                                        const resultado = rowData.resultado || 'N/A';
                                        const estilos = {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            width: '100%',
                                            height: '30px',
                                            borderRadius: '5px',
                                            margin: 'auto',
                                            color: 'white', // Color de texto para contraste
                                            background: resultado === 'CONFORME' ? '#1ea97c' : resultado === 'NO CUADRA' ? '#ff5733' : '#b0b0b0'
                                        };

                                        return <div style={estilos}>{resultado}</div>;
                                    }}
                                    style={{ textAlign: 'center', width: '10rem', position: 'sticky', right: "8.1rem", background: 'white' }}
                                />


                                <Column
                                    header='Acciones'
                                    body={accionesCampoTabla}
                                    style={{ textAlign: 'center', width: '5rem', position: 'sticky', right: 0, background: 'white' }}
                                />

                            </DataTable>
                        )}

                    </div>
                </div>
            </div>


            {/* Modals */}
            <ModalEditarSalir pasarAbrirModal={modalEditarSalir} pasarCerrarModal={funtCerrarEditar} pasarSalidaSeleccionado={salidaSeleccionado} pasarSetSalidas={setData2} />
            <ModalEditarSalidaCombustible pasarAbrirModal={modalEditarSalidaCombustible} pasarCerrarModal={funtCerrarEditarCombustible} pasarSetSalidas={setData} pasarSalidaSeleccionadoCombustible={salidaCombustibleSeleccionado} />
            <ModalEliminarSalidaCombustible pasarAbrirModalEliminar={modalEliminarSalidaCombustible} pasarCerrarModalEliminar={funtCerrarEliminarCombustible} pasarSetSalidas={setData} pasarSalidaSeleccionadoCombustible={salidaCombustibleSeleccionado} />

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