// Importa tus dependencias aquí
import React, { useState, useContext, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputNumber } from "primereact/inputnumber";
import { GetUltimaOrden } from "../Services/GetUltimaOrden";
import { InputText } from "primereact/inputtext";
import { GetProveedorOrden } from "../Services/GetProveedor";
import { GetProductosOrden } from "../Services/GetProductos";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { DataOrden } from "../Data/DataOrdenCompra";
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

export const EditarOrdenCompra = ({ pasarAbrirModalEditarOrden, pasarCerrarModalEditarOrden, pasarOrdenCompraSeleccionado, pasarSetOrden }) => {


    // Estado inicial de dataOrden sin filas vacías
    const [dataOrden, setDataOrden] = useState(DataOrden);

    const [cantidad, setCantidad] = useState(null);
    const [precioSoles, setPrecioSoles] = useState(null);
    const [precioDolares, setPrecioDolares] = useState(null);

    // Función para manejar los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataOrden({
            ...dataOrden,
            [name]: value.toUpperCase(),
        });
    };

    // Función para manejar el cambio del proveedor
    const handleProveedorChange = (proveedorSeleccionado) => {
        setDataOrden({
            ...dataOrden,
            proveedor_id: proveedorSeleccionado.id,
        });
    };

    // Función para manejar el cambio del producto
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const handleProductoChange = (productoSeleccionado) => {
        setProductoSeleccionado({
            SKU: productoSeleccionado.SKU,
            producto: productoSeleccionado.articulo.nombre,
            unidad_medida: productoSeleccionado.unidad_medida.nombre,
            precio_soles: productoSeleccionado.precio_soles,
            precio_dolares: productoSeleccionado.precio_dolares,
        });
    };

    // Función para agregar productos
    const agregarProducto = (e) => {
        e.preventDefault();
        console.log(productoSeleccionado)
        if (productoSeleccionado && cantidad && (precioDolares || precioSoles)) {
            setDataOrden((prevData) => ({
                ...prevData,
                productos: [
                    ...prevData.productos,
                    {
                        SKU: productoSeleccionado.SKU || '',
                        cantidad: cantidad || 0,
                        unidad_medida: productoSeleccionado.unidad_medida || '',
                        articulo: productoSeleccionado.producto || '',
                        precio_soles: precioSoles || '' ,
                        precio_dolares: precioDolares || '',
                    },
                ],
            }));
            setProductoSeleccionado(null);
            setCantidad(0);
            setPrecioSoles(0);
            setPrecioDolares(0);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Seleccione un producto y especifique la cantidad con el precio', life: 3000 });
        }
    };
    // Función para eliminar productos
    const eliminarProducto = (producto, e) => {
        e.preventDefault();
        setDataOrden((prevData) => ({
            ...prevData,
            productos: prevData.productos.filter(p => p.SKU !== producto.SKU)
        }));
    };



    //#region para generar Orden de Compra
    const { obtenerToken } = useContext(AuthContext);
    const toast = useRef(null);
    const GenerarOrden = async () => {
        try {
            const token = obtenerToken();
            console.log(dataOrden)

            if (token) {
                console.log("Editar",dataOrden)
                const respuestaPost = await axios.post(`http://127.0.0.1:8000/api/almacen/orden_compra/update/${pasarOrdenCompraSeleccionado.id}`, dataOrden, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

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
                    gestor_compra: item.gestor_compra || '',
                    solicitante: item.solicitante || '',
                    detalle: item.detalle || '',
                    cotizacion: item.cotizacion || '',
                    productos: item.orden_producto || []
                }))
                pasarSetOrden(OrdenAdaptado)
                // Restaurar los datos de categoría a su estado inicial
                const mensajeDelServidor = respuestaPost.data.resp
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                pasarCerrarModalEditarOrden()
            }
        } catch (error) {
            console.error("Error al generar Orden Compra:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Generar Orden', life: 3000 });
        }
    };
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Orden de Compra cancelado', life: 3000 });
    };
    const confirmarGenerar = () => {
        confirmDialog({
            message: '¿Está seguro de Generar Orden de Compra?',
            header: 'Confirmar Creación',
            icon: 'pi pi-exclamation-triangle',
            accept: GenerarOrden,
            reject
        });
    };

    useEffect(() => {
        if (pasarOrdenCompraSeleccionado) {
            console.log('Pasar Orden Compra Seleccionado:', pasarOrdenCompraSeleccionado);
            console.log('Productos:', pasarOrdenCompraSeleccionado.productos);
    
            const productosAdaptados = pasarOrdenCompraSeleccionado.productos.map(p => ({
                SKU: p.producto.SKU || '', 
                articulo:p.producto.articulo.nombre ||'',
                unidad_medida:p.producto.unidad_medida.nombre ||'',
                cantidad: p.cantidad || 0,
                precio_soles: p.precio_soles || '', 
                precio_dolares: p.precio_dolares || '', 
            })) || []; 
    
            setDataOrden(prevData => ({
                ...prevData,
                proveedor_id: pasarOrdenCompraSeleccionado.proveedor_id,
                orden_compra: pasarOrdenCompraSeleccionado.numero_compra,
                cotizacion: pasarOrdenCompraSeleccionado.cotizacion,
                detalle: pasarOrdenCompraSeleccionado.detalle,
                gestor_compra: pasarOrdenCompraSeleccionado.gestor_compra,
                requerimiento: pasarOrdenCompraSeleccionado.requerimiento,
                solicitante: pasarOrdenCompraSeleccionado.solicitante,
                productos: productosAdaptados
            }));
        }
    }, [pasarOrdenCompraSeleccionado]);
    


    //#region Columnas
    const footer = (
        <div>
            <Button label="Guardar" className="p-button-success" onClick={confirmarGenerar} />
            <Button label="Cancelar" className="p-button-secondary" onClick={pasarCerrarModalEditarOrden} />
        </div>
    );
    const ColumnaAcciones = (producto) => {
        return (
            <div className="BotonEliminar" style={{ display: 'flex', justifyContent: 'center' }}>
                <Button icon="pi pi-trash" severity="danger" style={{ color: '#FF6767', backgroundColor: '#FFECEC', border: 'none' }} aria-label="Eliminar" onClick={(e) => eliminarProducto(producto, e)} />
            </div>
        );
    };

    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Dialog
                header={<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "50px" }}>
                    <h3>Editar Orden de Compra</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalEditarOrden} />
                </div>}
                visible={pasarAbrirModalEditarOrden}
                style={{ width: "45%", minWidth: "300px" }}
                footer={footer}
                onHide={pasarCerrarModalEditarOrden}
                closable={false}
            >
                <form onSubmit={GenerarOrden}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: "flex", flexDirection: "column", gap: "25px" }}>
                            <FloatLabel>
                                <InputNumber id="orden_compra" name="orden_compra" style={{ width: '100%' }} value={dataOrden.orden_compra} disabled />
                                <label htmlFor="orden_compra" style={{ textAlign: "center", }}>Orden de Compra</label>
                            </FloatLabel>
                            <div className="primerDiv" style={{ display: "flex", gap: "10px" }}>
                                <FloatLabel style={{ width: "100%" }}>
                                    <InputText id="requerimiento" name="requerimiento" style={{ width: "100%" }} value={dataOrden.requerimiento} onChange={handleChange} />
                                    <label htmlFor="requerimiento" style={{ textAlign: "center" }}>Requerimiento</label>
                                </FloatLabel>
                                <FloatLabel style={{ width: "100%" }}>
                                    <InputText id="gestor_compra" name="gestor_compra" style={{ width: "100%" }} value={dataOrden.gestor_compra} onChange={handleChange} />
                                    <label htmlFor="gestor_compra" style={{ textAlign: "center" }}>Gestor de Compra</label>
                                </FloatLabel>
                                <FloatLabel style={{ width: "100%" }}>
                                    <InputText id="solicitante" name="solicitante" style={{ width: "100%" }} value={dataOrden.solicitante} onChange={handleChange} />
                                    <label htmlFor="solicitante" style={{ textAlign: "center" }}>Solicitante</label>
                                </FloatLabel>
                            </div>
                            <div className="segundoDiv" style={{ display: "flex", gap: "10px" }}>
                                <FloatLabel style={{ width: "100%" }}>
                                    <InputText id="detalle" name="detalle" style={{ width: "100%" }} value={dataOrden.detalle} onChange={handleChange} />
                                    <label htmlFor="detalle" style={{ textAlign: "center", }}>Detalle</label>
                                </FloatLabel>
                                <FloatLabel style={{ width: "100%" }}>
                                    <InputText id="cotizacion" name="cotizacion" style={{ width: "100%" }} value={dataOrden.cotizacion} onChange={handleChange} />
                                    <label htmlFor="cotizacion" style={{ textAlign: "center", }}>Cotizacion</label>
                                </FloatLabel>
                            </div>
                            <GetProveedorOrden pasarSetDataOrden={handleProveedorChange} pasarOrdenSeleccionado={pasarOrdenCompraSeleccionado} />
                            <GetProductosOrden pasarSetDataOrden={handleProductoChange} />
                            <div className="tercerDiv" style={{ display: "flex", gap: "10px" }}>
                                <FloatLabel style={{ width: "100%" }}>
                                    <InputNumber id="cantidad" name="cantidad" style={{ width: "100%" }} minFractionDigits={2} value={cantidad} onValueChange={(e) => setCantidad(e.value)} />
                                    <label htmlFor="cantidad" style={{ textAlign: "center", }}>Cantidad</label>
                                </FloatLabel>
                                <FloatLabel style={{ width: "100%" }}>
                                    <InputNumber id="precio_soles" name="precio_soles" style={{ width: "100%" }} minFractionDigits={2} prefix="S/ " value={precioSoles} onValueChange={(e) => setPrecioSoles(e.value)} />
                                    <label htmlFor="precio_soles" style={{ textAlign: "center", }}>Precio Soles</label>
                                </FloatLabel>
                                <FloatLabel style={{ width: "100%" }}>
                                    <InputNumber id="precio_dolares" name="precio_dolares" style={{ width: "100%" }} minFractionDigits={2} prefix="$/ " value={precioDolares} onValueChange={(e) => setPrecioDolares(e.value)} />
                                    <label htmlFor="precio_dolares" style={{ textAlign: "center", }}>Precio Dólares</label>
                                </FloatLabel>
                            </div>
                            <Button label="Agregar Producto" style={{ width: "100%" }} onClick={agregarProducto} />
                            {dataOrden.productos.length > 0 && (
                                <DataTable value={dataOrden.productos} style={{ marginTop: "20px" }}>
                                    <Column field="SKU" header="SKU" />
                                    <Column field="articulo" header="Producto" />
                                    <Column field="cantidad" header="Cantidad" />
                                    <Column field="unidad_medida" header="Unidad de Medida" />
                                    <Column field="precio_soles" header="Precio (S/)" />
                                    <Column field="precio_dolares" header="Precio ($)" />
                                    <Column body={ColumnaAcciones} header="Acciones" />
                                </DataTable>
                            )}

                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
};
