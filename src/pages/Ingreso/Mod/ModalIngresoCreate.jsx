import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
//importar axios
import axios from "axios";
//importar Data
import { DataIngreso } from "../Data/IngresoData";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputMask } from "primereact/inputmask";
import { InputTextarea } from 'primereact/inputtextarea';
import { GetProductos } from "../Services/GetProductos";
import { GetProveedor } from "../Services/GetProveedor";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetStock } from "../Services/GetStock";
import { SelectedProvider } from "../Components/SelectedProvider";
import { SelectedProduct } from "../Components/SelectedProduct";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import UseCreateIngreso from "../Hooks/UseCreateIngreso";
import { getIngreso } from "../Services/IngresoApi";


const ModalIngresoCreate = ({ pasarSetIngreso }) => {
    //obtener token
    const { obtenerToken } = useContext(AuthContext)
    //hooks
    const { Create } = UseCreateIngreso()
    //#region estado para modal
    const [modal, setModal] = useState(false)
    //abrir modal
    const abrirModal = () => {
        setModal(true)
    }
    //cerrar modal
    const cerrarModal = () => {
        setModal(false)
    }
    //#region funcion para consumir api de crear ingreso
    const [dataIngreso, setDataIngreso] = useState(DataIngreso)
    const CrearIngreso = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                console.log("Data Ingreso", dataIngreso)
                const responseServer = await Create(dataIngreso)
                const response = await getIngreso(token)
                const IngresoAdaptado = response.map(item => {
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
                        precio_soles: articulo.precio_soles || 0,
                        stock_logico: inventario.stock_logico || '',
                        unidad_medida: producto.unidad_medida?.nombre || '',
                        ingreso: item.numero_ingreso || '',
                        precio_unitario_soles: transaccion.precio_unitario_soles || 0,
                        precio_total_soles: transaccion.precio_total_soles || '',
                        precio_unitario_dolares: transaccion.precio_unitario_dolares || 0,
                        precio_total_dolares: transaccion.precio_total_dolares || '',
                        observaciones: transaccion.observaciones || '',
                    };
                });
                pasarSetIngreso(IngresoAdaptado)
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: responseServer, life: 3000 });
                cerrarModal()
            } else {
                toast.current.show({ severity: 'info', summary: 'Observación', detail: "Número de RUC no ingresado", life: 3000 });
            }
        } catch (error) {
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el Proveedor', life: 3000 });
        }
    }
    //#region Manejo de ingreso de datos en el Formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataIngreso(prevData => ({
            ...prevData,
            [name]: value.toUpperCase()
        }));
    };

    // Manejar cambios en los campos del formulario para solo proveedor
    const handleProveedorChange = (proveedorSeleccionado) => {
        setDataIngreso({
            ...dataIngreso,
            proveedor_id: proveedorSeleccionado.id
        });
    };

    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [numeroIngreso, setNumeroIngreso] = useState(null)
    const [marca, setMarca] = useState("")
    const [precioUnitarioSoles, setPrecioUnitarioSoles] = useState(0)
    const [precioUnitarioDolares, setPrecioUnitarioDolares] = useState(0)

    // Manejar cambios en los campos del formulario para solo producto
    const handleProductoChange = (productoSeleccionado) => {
        setProductoSeleccionado(productoSeleccionado)
    };

    const agregarProducto = (e) => {
        e.preventDefault();
        if (productoSeleccionado && numeroIngreso) {
            setDataIngreso({
                ...dataIngreso,
                productos: [
                    ...dataIngreso.productos,
                    {
                        SKU: productoSeleccionado.SKU,
                        marca: marca,
                        producto: productoSeleccionado.articulo.nombre,
                        numero_ingreso: numeroIngreso,
                        precio_unitario_soles: precioUnitarioSoles,
                        precio_unitario_dolares: precioUnitarioDolares,
                    },
                ],
            });
            //resetear los campos
            setProductoSeleccionado(null);
            setNumeroIngreso(0);
            setMarca("");
            setPrecioUnitarioSoles("");
            setPrecioUnitarioDolares("");
        } else {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione un producto y especifique la cantidad ', life: 3000 });
        }
    };
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;
        const productosActualizados = dataIngreso.productos.map((producto) => {
            if (producto.SKU === rowData.SKU) {
                return { ...producto, [field]: newValue };
            }
            return producto;
        });
        setDataIngreso({ ...dataIngreso, productos: productosActualizados });
    };
    // Función para eliminar productos
    const eliminarProducto = (producto, e) => {
        e.preventDefault();
        setDataIngreso((prevData) => ({
            ...prevData,
            productos: prevData.productos.filter(p => p.SKU !== producto.SKU)
        }));
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Ingreso cancelado', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de hacer este Ingreso?',
            header: 'Confirmar Ingreso',
            icon: 'pi pi-exclamation-triangle',
            accept: CrearIngreso,
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
            <Button icon="pi pi-plus" label="Registrar Ingreso" severity="info" outlined onClick={abrirModal} style={{ color: '#1A55B0' }} />
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Crear Ingreso</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={cerrarModal} />
                </div>}
                visible={modal}
                style={{ width: '40%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModal}
                closable={false}
            >
                <form onSubmit={CrearIngreso}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <div className="primerDiv" style={{ display: 'flex', gap: '10px' }}>
                                <div className="guia" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="guia_remision" name='guia_remision' style={{ width: '100%' }} value={dataIngreso.guia_remision || ''} onChange={handleInputChange} />
                                        <label htmlFor="guia_remision" style={{ textAlign: "center", }}>Guia de Remisión</label>
                                    </FloatLabel>

                                </div>
                                <div className="operacion" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="tipo_operacion" name="tipo_operacion" style={{ width: '100%' }} value={dataIngreso.tipo_operacion || ''} onChange={handleInputChange} />
                                        <label htmlFor="tipo_operacion" style={{ textAlign: "center", }}>Tipo de Operación</label>
                                    </FloatLabel>

                                </div>
                            </div>
                            <div className="segundoDiv" style={{ display: 'flex', gap: '10px' }}>
                                <div className="tipo" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="tipo_cp" name="tipo_cp" style={{ width: '100%' }} value={dataIngreso.tipo_cp || ''} onChange={handleInputChange} />
                                        <label htmlFor="tipo_cp" style={{ textAlign: "center", }}>Tipo de CP</label>
                                    </FloatLabel>
                                </div>
                                <div className="docu" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="documento" name="documento" style={{ width: '100%' }} value={dataIngreso.documento || ''} onChange={handleInputChange} />
                                        <label htmlFor="documento" style={{ textAlign: "center", }}>Documento</label>
                                    </FloatLabel>
                                </div>
                                <div className="orden" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputText id="orden_compra" name="orden_compra" style={{ width: '100%' }} value={dataIngreso.orden_compra || ''} onChange={handleInputChange} />
                                        <label htmlFor="orden_compra" style={{ textAlign: "center", }}>Orden de Compra</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <SelectedProvider pasarSetDataIngreso={handleProveedorChange} />
                            <SelectedProduct pasarSetDataIngreso={handleProductoChange} />
                            <FloatLabel>
                                <InputText id="marca" name="marca" style={{ width: '100%' }} value={dataIngreso.marca || ''} onChange={handleInputChange} />
                                <label htmlFor="marca" style={{ textAlign: "center", }}>Marca</label>
                            </FloatLabel>

                            <div className="stock" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                <div className="ingreso" style={{ width: '100%' }} >
                                    <FloatLabel>
                                        <InputNumber id="numero_ingreso" name="numero_ingreso" style={{ width: '100%' }} value={numeroIngreso || null} onChange={(e) => setNumeroIngreso(e.value)} minFractionDigits={2} min={0} />
                                        <label htmlFor="numero_ingreso" style={{ textAlign: "center" }}>Número de Ingreso</label>
                                    </FloatLabel>
                                </div>
                                <GetStock pasarProductoSeleccionado={productoSeleccionado?.SKU} />

                            </div>
                            <div className="precios" style={{ display: 'flex', gap: '10px' }}>
                                <div className="soles" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputNumber
                                            id="precio_unitario_soles"
                                            name="precio_unitario_soles"
                                            style={{ width: '100%' }}
                                            value={precioUnitarioSoles || 0}
                                            onChange={(e) => setPrecioUnitarioSoles(e.value)}
                                            showButtons
                                            buttonLayout="horizontal"
                                            step={0.25}
                                            mode="currency"
                                            currency="PEN"
                                            currencyDisplay="symbol"
                                            locale="es-PE"
                                        />

                                        <label htmlFor="precio_unitario_soles" style={{ textAlign: "center", }}>Precio Unitario Soles</label>
                                    </FloatLabel>
                                </div>

                                <div className="dolares" style={{ width: '100%' }}>
                                    <FloatLabel>
                                        <InputNumber
                                            id="precio_unitario_dolares"
                                            name="precio_unitario_dolares"
                                            value={dataIngreso.precio_unitario_dolares || 0}
                                            onValueChange={(e) => setPrecioUnitarioDolares(e.value)}
                                            showButtons
                                            buttonLayout="horizontal"
                                            step={0.25}
                                            style={{ width: '100%' }}
                                            mode="currency"
                                            currency="USD"
                                        />
                                        <label htmlFor="precio_unitario_dolares">Precio Unitario Dolares</label>
                                    </FloatLabel>
                                </div>
                            </div>
                            <Button label="Agregar Producto" style={{ width: "100%" }} onClick={agregarProducto} />
                            <DataTable value={dataIngreso.productos} editMode="cell" style={{ marginTop: "20px" }}>
                                <Column field="SKU" header="SKU" style={{ width: '5%' }} />
                                <Column field="producto" header="Producto" />
                                <Column field="numero_ingreso" header="Cantidad" editor={(options) => textEditor(options)} onCellEditComplete={onCellEditComplete} />
                                <Column
                                    field="precio_unitario_soles"
                                    header="Precio Unitario Soles"
                                    body={(rowData) => `S/ ${rowData.precio_unitario_soles}`}
                                    editor={(options) => textEditor(options)}
                                    onCellEditComplete={onCellEditComplete}
                                />

                                <Column
                                    field="precio_unitario_dolares"
                                    header="Precio Unitario Dolares"
                                    body={(rowData) => `$/ ${rowData.precio_unitario_dolares}`}
                                    editor={(options) => textEditor(options)}
                                    onCellEditComplete={onCellEditComplete}
                                />
                                <Column body={ColumnaAcciones} header="Acciones" style={{ width: '5%' }} />
                            </DataTable>
                            <FloatLabel>
                                <InputTextarea id="observaciones" name="observaciones" style={{ width: '100%' }} value={dataIngreso.observaciones || ''} onChange={handleInputChange} />
                                <label htmlFor="observaciones" style={{ textAlign: "center", }}>Observaciones</label>
                            </FloatLabel>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
};

export default ModalIngresoCreate;