import styled from "styled-components";
import React, { useState, useEffect } from 'react';
//TABLA REACT PRIME
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
//Importar Columnas Visibles
import { DataInventario, InicialDataInventario } from "../Data/DataInventario";
//Importar Axios
import axios from "axios";
import { FiltradoInventario } from "../Components/FiltradoInventario";
import ModalCrearInventario from "../Mod/ModalCrearInventario";
import { Button } from "primereact/button";
import ModalEliminarInventario from "../Mod/ModalEliminarInventario";
import "../../../Css/Drop.css";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ImportarInventario } from "../Components/ImportarInventario";
import { ExportarInventario } from "../Components/ExportarInventario";
import { ProgressSpinner } from 'primereact/progressspinner';
import { ModalEditarInventario } from "../Mod/ModalEditarInventario";

export function InventarioPage() {
    //#region para el cargado
    const [cargando, setCargando] = useState(false);

    //obtener token
    const { obtenerToken } = useContext(AuthContext);

    //#region Estado para las columnas visibles en la tabla
    const [columnasVisibles, setColumnasVisibles] = useState(InicialDataInventario);
    // Función para manejar el cambio de columnas visibles en la tabla
    const manejarCambioColumnas = (evento) => {
        const columnasSeleccionadas = evento.value;
        // Filtramos las columnas visibles basadas en las seleccionadas por el usuario
        const columnasOrdenadasSeleccionadas = InicialDataInventario.filter(col =>
            columnasSeleccionadas.some(sCol => sCol.field === col.field)
        );
        // Actualizamos el estado de columnas visibles
        setColumnasVisibles(columnasOrdenadasSeleccionadas);
    };

    //#region Estado para almacenar la lista de inventario
    const [inventario, setInventario] = useState([]);
    // Efecto para cargar los datos iniciales del personal desde la API al montar el componente
    useEffect(() => {
        const obtenerInventario = async () => {
            try {
                const token = obtenerToken()
                if (token) {
                    setCargando(true);
                    const respuestaGet = await axios.get("https://jwmalmcenb-production.up.railway.app/api/almacen/inventario_valorizado/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(respuestaGet.data.data)

                    // Mapeamos los datos recibidos para ajustarlos a la estructura deseada
                    const InventarioAdaptado = respuestaGet.data.data.map(item => ({
                        id: item.id || '',
                        ubicacion_id: item.inventario.ubicacion?.id || '',
                        ubicacion: item.inventario.ubicacion?.codigo_ubicacion || '',
                        SKU: item.inventario.producto?.SKU || '',
                        familia_id: item.inventario?.producto?.articulo?.sub_familia?.familia_id ?? null,
                        familia: item.inventario?.producto?.articulo?.sub_familia?.familia?.familia ?? null,
                        sub_familia_id: item.inventario.producto.articulo?.sub_familia_id || '',
                        sub_familia: item.inventario.producto.articulo.sub_familia?.nombre || '',
                        nombre: item.inventario.producto.articulo?.nombre || '',
                        unidad_medida_id: item.inventario.producto?.unidad_medida_id || '',
                        unidad_medida: item.inventario.producto.unidad_medida?.nombre || '',
                        fecha_salida: item.inventario.producto.transacciones[1]?.salida[0]?.fecha || '',
                        fecha_ingreso: item.inventario.producto.transacciones[0]?.ingreso[0]?.fecha || '',
                        precio_dolares: item.inventario.producto.articulo?.precio_dolares || 0,
                        precio_soles: item.inventario.producto.articulo?.precio_soles || 0,
                        valor_inventario_soles: item.valor_inventario_soles || 0,
                        valor_inventario_dolares: item.valor_inventario_dolares || 0,
                        total_ingreso: item.inventario?.total_ingreso || '',
                        total_salida: item.inventario?.total_salida || '',
                        stock_logico: item.inventario?.stock_logico || '',
                        demanda_mensual: item.inventario?.demanda_mensual || '',
                        estado_operativo: item.inventario.estado_operativo?.nombre || '',
                    }))
                    setCargando(false);
                    setInventario(InventarioAdaptado);
                } else {
                    console.log("No se encontró un token de autenticación válido");
                    setCargando(false);
                }
            } catch (error) {
                console.error("Error al obtener el Inventario:", error); // Manejo de errores en la solicitud HTTP
                setCargando(false);
            }
        };
        obtenerInventario(); // Llamamos a la función para obtener los datos
    }, []); // El efecto se ejecuta solo una vez al montar el componente

    //#region  Estado para el filtro de búsqueda
    const [filtro, setFiltro] = useState('');
    //funcion para filtrar el Inventario basado en el filtro de busqueda
    const inventarioFiltrado = inventario.filter(p => {
        const ubicacion = p.ubicacion || '';
        const SKU = p.SKU || '';
        const familia = p.familia || '';
        const sub_familia = p.sub_familia || '';
        const nombre = p.nombre || '';
        const unidad_medida = p.unidad_medida || '';
        const fecha_salida = p.fecha_salida || '';
        const fecha_ingreso = p.fecha_ingreso || '';
        const precio_soles = p.precio_soles || '';
        const valor_inventario_soles = p.valor_inventario_soles || '';
        const precio_dolares = p.precio_dolares || '';
        const valor_inventario_dolares = p.valor_inventario_dolares || '';
        const total_ingreso = p.total_ingreso || '';
        const total_salida = p.total_salida || '';
        const stock_logico = p.stock_logico || '';
        const demanda_mensual = p.demanda_mensual || '';
        const estado_operativo = p.estado_operativo || '';
        return (
            ubicacion.toLowerCase().includes(filtro.toLowerCase()) ||
            SKU.toLowerCase().includes(filtro.toLowerCase()) ||
            familia.toLowerCase().includes(filtro.toLowerCase()) ||
            sub_familia.toLowerCase().includes(filtro.toLowerCase()) ||
            nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            unidad_medida.toLowerCase().includes(filtro.toLowerCase()) ||
            fecha_salida.toLowerCase().includes(filtro.toLowerCase()) ||
            fecha_ingreso.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_dolares.toLowerCase().includes(filtro.toLowerCase()) ||
            precio_soles.toLowerCase().includes(filtro.toLowerCase()) ||
            valor_inventario_soles.toLowerCase().includes(filtro.toLowerCase()) ||
            valor_inventario_dolares.toLowerCase().includes(filtro.toLowerCase()) ||
            total_ingreso.toLowerCase().includes(filtro.toLowerCase()) ||
            total_salida.toLowerCase().includes(filtro.toLowerCase()) ||
            stock_logico.toLowerCase().includes(filtro.toLowerCase()) ||
            demanda_mensual.toLowerCase().includes(filtro.toLowerCase()) ||
            estado_operativo.toLowerCase().includes(filtro.toLowerCase())
        )
    })
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
    const botonImportar = <ImportarInventario pasarSetInventario={setInventario} />;

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
            <div className="contenedor" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                <div className="encabezado" style={{ width: '100%', color: '#1A55B0', display:'flex', flexDirection:'column'}}>
                    <span style={{fontSize:'30px', fontWeight:'bold'}} > Gestión de Inventario </span>
                    <span style={{ color: '#1A55B0', fontSize:'15px' }}>
                        En este modulo usteded podra administrar los el inventario
                    </span>
                </div>

                <div className="acciones" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="crearInventario">
                        <ModalCrearInventario pasarSetInventario={setInventario} />
                    </div>
                    <div className="search">
                        <FiltradoInventario filtro={filtro} setFiltro={setFiltro} />
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
                                value={inventarioFiltrado}
                                header={
                                    <MultiSelectContainer>
                                        <MultiSelect
                                            value={columnasVisibles}
                                            options={InicialDataInventario}
                                            optionLabel="header"
                                            onChange={manejarCambioColumnas}
                                            display="chip"
                                        />
                                    </MultiSelectContainer>
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
                pasarSetInventario={setInventario}
                pasarInventarioSeleccionado={inventarioSeleccionado} />
            <ModalEliminarInventario
                pasarAbrirModalEliminar={modalEliminar}
                pasarCerrarModalEliminar={cerrarModalEliminarInventario}
                pasarSetInventario={setInventario}
                pasarInventarioSeleccionado={inventarioSeleccionado}
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
