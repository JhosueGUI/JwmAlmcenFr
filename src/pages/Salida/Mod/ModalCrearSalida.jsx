import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { DataSalida } from "../Data/SalidaData";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetStock } from "../../Ingreso/Services/GetStock";
import { SeleccionarPersonal } from "../Components/SeleccionarPersonal";
import { SeleccionarUnidad } from "../Components/SeleccionarUnidad";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SeleccionarProducto } from "../Components/SeleccionarProducto";
import UseCreateProduct from "../hooks/UseCreateProduct";
import { getSalida } from "../Services/SalidaApi";

const ModalCrearSalida = ({ pasarSetSalidas }) => {
    //hooks
    const { Create } = UseCreateProduct()
    //const token
    const { obtenerToken } = useContext(AuthContext)
    //#region estado para abrir y cerrar modal de crear
    const [modal, setModal] = useState(false)
    const abrirModal = () => {
        setModal(true)
    }
    const cerrarModal = () => {
        setModal(false)
    }

    //#region estado para traer la data de salida
    const [dataSalida, setDataSalida] = useState(DataSalida)
    //funcion para crear salida
    const CrearSalida = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                const responseServer = await Create(dataSalida)
                const response = await getSalida(token)
                const salidaAdapted = response.map(item => {
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
                pasarSetSalidas(salidaAdapted)
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: responseServer, life: 3000 });
                cerrarModal()
            } else {
                toast.current.show({ severity: 'info', summary: 'Observación', detail: "Número de RUC no ingresado", life: 3000 });
            }
        } catch (error) {
            console.log("Error", error)
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Registrar Salida', life: 3000 });

        }
    }
    //#region para manejar los valores de los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setDataSalida(prevData => ({
            ...prevData,
            [name]: value.toUpperCase()
        }))
    }
    // Manejar cambios en los campos del formulario para solo Personal
    const handlePersonalChange = (personalSeleccionado) => {
        setDataSalida({
            ...dataSalida,
            personal_id: personalSeleccionado.id
        });
    };
    // Manejar cambios en los campos del formulario para solo Productos
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [numeroSalida, setNumeroSalida] = useState(0)
    const [marca, setMarca] = useState("")

    const handleProductosChange = (productoSeleccionado) => {
        setProductoSeleccionado(productoSeleccionado)
    };

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;
        const productosActualizados = dataSalida.productos.map((producto) => {
            if (producto.SKU === rowData.SKU) {
                return { ...producto, [field]: newValue };
            }
            return producto;
        });
        setDataSalida({ ...dataSalida, productos: productosActualizados });
    };

    const agregarProducto = (e) => {
        e.preventDefault();
        if (productoSeleccionado && numeroSalida) {
            setDataSalida({
                ...dataSalida,
                productos: [
                    ...dataSalida.productos,
                    {
                        SKU: productoSeleccionado.SKU,
                        producto: productoSeleccionado.articulo.nombre,
                        numero_salida: numeroSalida,
                        marca: marca,
                    },
                ],
            });
            //resetear los campos
            setProductoSeleccionado(null);
            setNumeroSalida(0);
            setMarca("");
        } else {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione un producto y especifique la cantidad ', life: 3000 });
        }
    };
    // Función para eliminar productos
    const eliminarProducto = (producto, e) => {
        e.preventDefault();
        setDataSalida((prevData) => ({
            ...prevData,
            productos: prevData.productos.filter(p => p.SKU !== producto.SKU)
        }));
    };

    // Manejar cambios en los campos del formulario para solo Unidad
    const handleUnidadChange = (unidadSeleccionado) => {
        setDataSalida({
            ...dataSalida,
            unidad: unidadSeleccionado.placa
        });
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Salida cancelado', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de hacer esta Salida?',
            header: 'Confirmar Salida',
            icon: 'pi pi-exclamation-triangle',
            accept: CrearSalida,
            reject
        });
    };
    const ColumnaAcciones = (producto) => {
        return (
            <div className="BotonEliminar" style={{ display: 'flex', justifyContent: 'center' }}>
                <Button icon="pi pi-trash" severity="danger" style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} aria-label="Eliminar" onClick={(e) => eliminarProducto(producto, e)} />
            </div>
        );
    };
    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarCreacion} className="p-button-success" />
            <Button label="Cancelar" onClick={cerrarModal} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            <ConfirmDialog />
            {/* Contenido */}
            <Button icon="pi pi-plus" label="Registrar Salida" severity="info" outlined style={{ color: '#1A55B0' }} onClick={abrirModal} />

            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Registrar Salida</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={cerrarModal} />
                </div>}
                visible={modal}
                style={{ width: '40%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModal}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        <div className="primerDiv" style={{ display: "flex", gap: '10px' }}>
                            <div className="vale" style={{ width: '100%' }}>
                                <FloatLabel >
                                    <InputNumber id="vale" name="vale" style={{ width: '100%' }} value={dataSalida.vale || null} onChange={(e) => setDataSalida({ ...dataSalida, vale: e.value })} />
                                    <label htmlFor="vale" style={{ textAlign: "center", }}>Vale</label>
                                </FloatLabel>
                            </div>
                            <div className="operacion" style={{ width: '100%' }}>
                                <FloatLabel>
                                    <InputText id="tipo_operacion" name="tipo_operacion" style={{ width: '100%' }} value={dataSalida.tipo_operacion} onChange={handleInputChange} />
                                    <label htmlFor="tipo_operacion" style={{ textAlign: "center", }}>Tipo de Operacion</label>
                                </FloatLabel>
                            </div>
                            <div className="destino" style={{ width: '100%' }}>
                                <FloatLabel>
                                    <InputText id="destino" name="destino" style={{ width: '100%' }} value={dataSalida.destino} onChange={handleInputChange} />
                                    <label htmlFor="destino" style={{ textAlign: "center", }}>Destino</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div className="SegundoDiv" style={{ display: 'flex', gap: '10px' }}>
                            <SeleccionarPersonal pasarSetDataSalida={handlePersonalChange} />
                            <SeleccionarUnidad pasarSetDataSalida={handleUnidadChange} />
                        </div>
                        <div className="divTres" style={{ display: 'flex', gap: '10px' }}>
                            <div className="neumatico" style={{ width: '100%' }}>
                                <FloatLabel>
                                    <InputText id="duracion_neumatico" name="duracion_neumatico" style={{ width: '100%' }} value={dataSalida.duracion_neumatico} onChange={handleInputChange} />
                                    <label htmlFor="duracion_neumatico" style={{ textAlign: "center", }}>Duracion de Neumático</label>
                                </FloatLabel>
                            </div>
                            <div className="kilometraje" style={{ width: '100%' }}>
                                <FloatLabel>
                                    <InputText id="kilometraje_horometro" name="kilometraje_horometro" style={{ width: '100%' }} value={dataSalida.kilometraje_horometro} onChange={handleInputChange} />
                                    <label htmlFor="kilometraje_horometro" style={{ textAlign: "center", }}>Kilometraje / Horómetro</label>
                                </FloatLabel>
                            </div>
                            <div className="fecha" style={{ width: '100%' }}>
                                <FloatLabel>
                                    <InputText id="fecha_vencimiento" name="fecha_vencimiento" style={{ width: '100%' }} value={dataSalida.fecha_vencimiento} onChange={handleInputChange} />
                                    <label htmlFor="fecha_vencimiento" style={{ textAlign: "center", }}>Fecha de Vencimiento</label>
                                </FloatLabel>
                            </div>
                        </div>
                        <div className="divCuarto" style={{ display: 'flex', gap: '10px' }}>
                            <div className="Sku" style={{ width: '100%' }}>
                                {/* <GetProductosSalida pasarSetDataSalida={handleProductosChange} /> */}
                                <SeleccionarProducto pasarSetDataSalida={handleProductosChange} />
                            </div>
                            <div className="salida" style={{ width: '100%' }} >
                                <FloatLabel>
                                    <InputNumber id="numero_salida" name="numero_salida" style={{ width: '100%' }} value={numeroSalida || null} onChange={(e) => setNumeroSalida(e.value)} minFractionDigits={2} min={0} />
                                    <label htmlFor="numero_salida" style={{ textAlign: "center", }}>Numero de Salida</label>
                                </FloatLabel>
                            </div>
                            <div className="marca" style={{ width: '100%' }}>
                                <FloatLabel>
                                    <InputText
                                        id="marca"
                                        name="marca"
                                        style={{ width: '100%' }}
                                        value={marca || ''}
                                        onChange={(e) => setMarca(e.target.value)}
                                    />
                                    <label htmlFor="marca" style={{ textAlign: "center" }}>
                                        Marca
                                    </label>
                                </FloatLabel>
                            </div>
                            <GetStock pasarProductoSeleccionado={productoSeleccionado?.SKU} />
                        </div>
                        <Button label="Agregar Producto" style={{ width: "100%" }} onClick={agregarProducto} />
                        <DataTable value={dataSalida.productos} editMode="cell" style={{ marginTop: "20px" }}>
                            <Column field="SKU" header="SKU" style={{ width: '5%' }} />
                            <Column field="producto" header="Producto" />
                            <Column field="numero_salida" header="Numero de Salida" editor={(options) => textEditor(options)} onCellEditComplete={onCellEditComplete} style={{ width: '35%' }} />
                            <Column body={ColumnaAcciones} header="Acciones" style={{ width: '5%' }} />
                        </DataTable>
                        <FloatLabel>
                            <InputTextarea id="observaciones" name="observaciones" style={{ width: '100%' }} value={dataSalida.observaciones} onChange={handleInputChange} />
                            <label htmlFor="observaciones" style={{ textAlign: "center", }}>Observaciones</label>
                        </FloatLabel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ModalCrearSalida;