import styled from "styled-components";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ColumnasInicialesSalida, ColumnasInicialesSalidaCombustible } from "../Data/SalidaData";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ModalCrearSalida from "../Mod/ModalCrearSalida";
import ModalEditarSalir from "../Mod/ModalEditarSalida";
import { FiltradoSalida } from "../Components/FiltradoSalida";
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
import { GetStockCombustible } from "../Services/SalidaCombustibleApi";
import { Tag } from "primereact/tag";
import ModalEliminarSalidaCombustible from "../Mod/ModalEliminarSalidaCombustible";

export function SalidaPage() {
    //#hooks
    const { respuesta } = UsarGetStockCombustible()
    const [combustible, setCombustible] = useState([])

    useEffect(() => {
        setCombustible(respuesta);
    }, [respuesta]);

    //#region para el cargado
    const [cargando, setCargando] = useState(false);
    //obtener token
    const { obtenerToken } = useContext(AuthContext)
    //#region estado para las columnas visibles
    const [columnasVisibles, setColumnasVisibles] = useState(ColumnasInicialesSalida)
    const [columnasVisiblesCombustible, setColumnasVisiblesCombustible] = useState(ColumnasInicialesSalidaCombustible)

    // Función para manejar el cambio de columnas visibles en la tabla
    const manejarCambioColumnas = (e) => {
        const columnasSeleccionadas = e.value
        const columnasOrdenadasSeleccionadas = ColumnasInicialesSalida.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        )
        setColumnasVisibles(columnasOrdenadasSeleccionadas)
    }
    const manejarCambioColumnasCombustible = (e) => {
        const columnasSeleccionadas = e.value
        const columnasOrdenadasSeleccionadas = ColumnasInicialesSalidaCombustible.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        )
        setColumnasVisiblesCombustible(columnasOrdenadasSeleccionadas)
    }
    //#region para formatear los precios
    const formatearPrecioSoles = (precio) => {
        return `S/. ${parseFloat(precio).toFixed(2)}`;
    }
    const formatearPrecioDolares = (precio) => {
        return `$/. ${parseFloat(precio).toFixed(2)}`;
    };

    //#region para traer a todas las salidas
    const [salidas, setSalidas] = useState([]);
    const [salidasCombustible, setSalidasCombustible] = useState([]);

    useEffect(() => {
        const TraerRegistroSalidas = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    setCargando(true);
                    const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/salida/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const SalidaAdaptado = respuestaGet.data.data.map(item => {
                        let personal = null;
                        if (item.personal && item.personal.persona) {
                            personal = `${item.personal.persona?.nombre || ''} ${item.personal.persona?.apellido_paterno || ''} ${item.personal.persona?.apellido_materno || ''}`;
                        }
                        return {
                            id: item.id || '',
                            fecha: item.fecha || '',
                            vale: item.vale || '',
                            tipo_operacion: item.transaccion?.tipo_operacion || '',
                            destino: item.destino || '',
                            personal: personal,
                            personalId: item.personal?.id || '',
                            unidad: item.unidad || '',
                            duracion_neumatico: item.duracion_neumatico || '',
                            kilometraje_horometro: item.kilometraje_horometro || '',
                            fecha_vencimiento: item.fecha_vencimiento || '',
                            SKU: item.transaccion.producto?.SKU || '',
                            familia: item.transaccion.producto.articulo.sub_familia.familia?.familia || '',
                            sub_familia: item.transaccion.producto.articulo.sub_familia?.nombre || '',
                            articulo: item.transaccion.producto.articulo?.nombre || '',
                            marca: item.transaccion.marca || '',
                            precio_dolares: item.transaccion.producto.articulo?.precio_dolares || 0,
                            precio_soles: item.transaccion.producto.articulo?.precio_soles || 0,
                            stock_logico: item.transaccion.producto.inventario?.stock_logico || '',
                            unidad_medida: item.transaccion.producto.unidad_medida?.nombre || '',
                            salida: item.numero_salida || '',
                            precio_unitario_soles: item.transaccion?.precio_unitario_soles || 0,
                            precio_total_soles: item.transaccion?.precio_total_soles || 0,
                            precio_unitario_dolares: item.transaccion?.precio_unitario_dolares || 0,
                            precio_total_dolares: item.transaccion?.precio_total_dolares || 0,
                            observaciones: item.transaccion?.observaciones || ''
                        }
                    })
                    setCargando(false);
                    setSalidas(SalidaAdaptado)
                }
            } catch (error) {
                setCargando(false);
                console.log("Error al traer Ingresos", error)
            }
        }
        const TraerRegistroSalidasCombustible = async () => {
            try {
                const token = obtenerToken();
                if (token) {
                    setCargando(true);
                    const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/salida_combustible/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const SalidaCombustibleAdaptado = respuestaGet.data.data.map(item => {
                        return {
                            id: item.id || '',
                            fecha: item.fecha || '',
                            flota_id: item.flota?.id || '',
                            placa: item.flota?.placa || '',
                            tipo: item.flota?.tipo || '',
                            personal_id: item.personal?.id || '',
                            nombre: item.personal?.persona?.nombre || '',
                            destino_combustible_id: item.destino_combustible?.id || '',
                            destino: item.destino_combustible?.nombre || '',
                            numero_salida_ruta: item.numero_salida_ruta || '',
                            numero_salida_stock: item.numero_salida_stock || '',
                            precio_unitario_soles: item.precio_unitario_soles || '',
                            precio_total_soles: item.precio_total_soles || '',
                            contometro_surtidor: item.contometro_surtidor || '',
                            margen_error_surtidor: item.margen_error_surtidor || '',
                            resultado: item.resultado || '',
                            precinto_nuevo: item.precinto_nuevo || '',
                            precinto_anterior: item.precinto_anterior || '',
                            kilometraje: item.kilometraje || '',
                            horometro: item.horometro || '',
                            observacion: item.observacion || ''
                        }
                    })
                    setCargando(false);

                    setSalidasCombustible(SalidaCombustibleAdaptado)
                }
            } catch (error) {
                setCargando(false);
                console.log("Error al traer Ingresos", error)
            }
        }
        TraerRegistroSalidasCombustible()
        TraerRegistroSalidas()
    }, [])
    //#region para el filtro
    const [filtro, setFiltro] = useState('')

    const SalidaFiltrado = salidas.filter(p => {
        const fecha = p.fecha || ''
        const vale = p.vale || ''
        const tipo_operacion = p.tipo_operacion || ''
        const destino = p.destino || ''
        const personal = p.personal || ''
        const unidad = p.unidad || ''
        const duracion_neumatico = p.duracion_neumatico || ''
        const kilometraje_horometro = p.kilometraje_horometro || ''
        const fecha_vencimiento = p.fecha_vencimiento || ''
        const SKU = p.SKU || ''
        const familia = p.familia || ''
        const sub_familia = p.sub_familia || ''
        const articulo = p.articulo || ''
        const marca = p.marca || ''
        const precio_dolares = p.precio_dolares || ''
        const precio_soles = p.precio_soles || ''
        const stock_logico = p.stock_logico || ''
        const unidad_medida = p.unidad_medida || ''
        const salida = p.salida || ''
        const precio_unitario_soles = p.precio_unitario_soles || ''
        const precio_total_soles = p.precio_total_soles || ''
        const precio_unitario_dolares = p.precio_unitario_dolares || ''
        const precio_total_dolares = p.precio_total_dolares || ''
        const observaciones = p.observaciones || ''
        return (
            fecha.toLowerCase().includes(filtro.toLowerCase()) ||
            vale.toLowerCase().includes(filtro.toLowerCase()) ||
            tipo_operacion.toLowerCase().includes(filtro.toLowerCase()) ||
            destino.toLowerCase().includes(filtro.toLowerCase()) ||
            personal.toLowerCase().includes(filtro.toLowerCase()) ||
            unidad.toLowerCase().includes(filtro.toLowerCase()) ||
            duracion_neumatico.toLowerCase().includes(filtro.toLowerCase()) ||
            kilometraje_horometro.toLowerCase().includes(filtro.toLowerCase()) ||
            fecha_vencimiento.toLowerCase().includes(filtro.toLowerCase()) ||
            SKU.toLowerCase().includes(filtro.toLowerCase()) ||
            familia.toLowerCase().includes(filtro.toLowerCase()) ||
            sub_familia.toLowerCase().includes(filtro.toLowerCase()) ||
            articulo.toLowerCase().includes(filtro.toLowerCase()) ||
            marca.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_dolares.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_soles.toLowerCase().includes(filtro.toLowerCase()) ||
            stock_logico.toLowerCase().includes(filtro.toLowerCase()) ||
            unidad_medida.toLowerCase().includes(filtro.toLowerCase()) ||
            salida.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_unitario_dolares.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_unitario_soles.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_total_dolares.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_total_soles.toLowerCase().includes(filtro.toLowerCase()) ||
            observaciones.toLowerCase().includes(filtro.toLowerCase())
        )
    })

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
    const functAbrirEliminarCombustible=(idSalir)=>{
        setModalEliminarSalidaCombustible(true)
        setSalidaCombustibleSeleccionado(idSalir)
    }
    const funtCerrarEliminarCombustible=()=>{
        setModalEliminarSalidaCombustible(false)
    }
    //

    const botonDescargar = <ExportarSalida />;
    const botonImportar = <ImportarSalida pasarSetSalida={setSalidas} />;

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
                    <Button icon="pi pi-trash" severity="danger" style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} aria-label="Eliminar" onClick={()=>{ functAbrirEliminarCombustible(id)}} />
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
                        <span style={{fontSize:'30px', fontWeight:'bold'}}>Gestión de Salidas </span>
                        <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    </div>
                    <div className="ContentE">
                        <span style={{ color: '#1A55B0', fontSize:'15px' }}>
                            En este modulo usteded podra administrar el registro de las Salidas
                        </span>
                    </div>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {activeIndex === 0 && (
                        <>
                            <ModalCrearSalida pasarSetSalidas={setSalidas} />
                            <FiltradoSalida filtro={filtro} setFiltro={setFiltro} />
                        </>
                    )}
                    {activeIndex === 1 && (

                        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <ModalCrearSalidaCombustible pasarSetSalidas={setSalidasCombustible} pasarSetCombustible={setCombustible}/>

                            <Button style={{ fontSize: '17px', background: combustible.alerta === 'Solicitar Combustible' ? '#FFECEC' : '#BFF1DF', color: combustible.alerta === 'Solicitar Combustible' ? '#FF6767' : '#248D63', borderColor: combustible.alerta === 'Solicitar Combustible' ? '#FF6767' : '#248D63' }}>
                                {combustible.alerta} : {combustible.stock}
                            </Button>

                        </div>
                    )}
                </div>



                <div className="contenido" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="tabla-contenedor" style={{ width: '100%' }}>
                        {activeIndex === 0 && (
                            <DataTable
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10]}
                                paginatorRight={botonDescargar}
                                paginatorLeft={botonImportar}
                                value={SalidaFiltrado}
                                header={
                                    <MultiSelectContainer>
                                        <MultiSelect
                                            value={columnasVisibles}
                                            options={ColumnasInicialesSalida}
                                            optionLabel="header"
                                            onChange={manejarCambioColumnas}
                                            display="chip"
                                        />
                                    </MultiSelectContainer>
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
                                paginator rows={10}
                                rowsPerPageOptions={[5, 10]}
                                paginatorRight={botomExportarCombustible}
                                paginatorLeft={botonImportar}
                                value={salidasCombustible}
                                header={
                                    <MultiSelectContainer>
                                        <MultiSelect
                                            value={columnasVisiblesCombustible}
                                            options={ColumnasInicialesSalidaCombustible}
                                            optionLabel="header"
                                            onChange={manejarCambioColumnasCombustible}
                                            display="chip"
                                        />
                                    </MultiSelectContainer>
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
            <ModalEditarSalir pasarAbrirModal={modalEditarSalir} pasarCerrarModal={funtCerrarEditar} pasarSalidaSeleccionado={salidaSeleccionado} pasarSetSalidas={setSalidas} />
            <ModalEditarSalidaCombustible pasarAbrirModal={modalEditarSalidaCombustible} pasarCerrarModal={funtCerrarEditarCombustible} pasarSetSalidas={setSalidasCombustible} pasarSalidaSeleccionadoCombustible={salidaCombustibleSeleccionado} />
            <ModalEliminarSalidaCombustible pasarAbrirModalEliminar={modalEliminarSalidaCombustible} pasarCerrarModalEliminar={funtCerrarEliminarCombustible} pasarSetSalidas={setSalidasCombustible} pasarSalidaSeleccionadoCombustible={salidaCombustibleSeleccionado}/>
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