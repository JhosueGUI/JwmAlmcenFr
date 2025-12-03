import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Toast } from 'primereact/toast';
import { useContext, useRef, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { DataProductoOrden } from "../Data/DataOrdenCompra";
import { GetUnidadMedidaOrden } from "../Services/GetUnidadMedidaOrden";
import { GetFamiliasOrden } from "../Services/GetFamiliasOrden";
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { GetUltimoSku } from "../../Inventario/Services/GetUltimoSku";

export const ModalCrearProducto = ({ pasarSetProducto }) => {
    //#region para el cargado
    const [cargando, setCargando] = useState(false);
    //obtener token
    const { obtenerToken } = useContext(AuthContext);
    //#region para abrir moldal Inventario
    const [modalInventario, setModalInventario] = useState(false);

    const abrirModalInventario = () => {
        setModalInventario(true);
    }

    const cerrarModalInventario = () => {
        setModalInventario(false);
    }
    const crearInventario = (e) => {
        e.preventDefault()
        abrirModalInventario()
    }
    //#region para crear producto
    const [dataProducto, setDataProducto] = useState(DataProductoOrden)

    const CrearProduto = async () => {
        try {
            const token = obtenerToken()
            if (token) {
                setCargando(true);
                const respuestaPost = await axios.post("http://127.0.0.1:8000/api/almacen/orden_compra/producto/create", dataProducto, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/producto/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const productosConFiltro = respuestaGet.data.data.map(producto => ({
                    ...producto,
                    filtro: `${producto.SKU} ${producto.articulo?.nombre}`
                }));
                setCargando(false);
                pasarSetProducto(productosConFiltro);
                const mensajeDelServidor = respuestaPost.data.resp
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                cerrarModalInventario();
            }
        } catch (error) {
            console.log(error)
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el Producto', life: 3000 });
            setCargando(false);
        }
    }
    //#region manejar inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataProducto(
            prevData => ({
                ...prevData,
                [name]: value.toUpperCase()
            })
        )
    };
    // Manejar cambios en los campos del formulario para solo UNIDAD DE MEDIDAD
    const handleUnidadDeMedidaChange = (unidadMedidaSeleccionada) => {
        setDataProducto({
            ...dataProducto,
            unidad_medida_id: unidadMedidaSeleccionada.id
        });
    };
    // Manejar cambios en los campos del formulario para solo Sub_Familia
    const handleSubFamiliaChange = (subFamiliaSeleccionada) => {
        setDataProducto({
            ...dataProducto,
            sub_familia_id: subFamiliaSeleccionada.id
        });
    };
    // Maneja cambio solo para el sku nuevo
    const handleSKUChange = (nuevoSKU) => {
        setDataProducto({
            ...dataProducto,
            SKU: nuevoSKU 
        });
    };
    //#region para toast
    const toast = useRef(null);

    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Registro de Producto cancelado', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de registrar este producto?',
            header: 'Confirmar Registro',
            icon: 'pi pi-exclamation-triangle',
            accept: CrearProduto,
            reject
        });
    };

    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarCreacion} className="p-button-success" />
            <Button label="Cancelar" onClick={cerrarModalInventario} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Button style={{ background: 'rgb(34, 197, 94)', border: '1px solid rgb(34, 197, 94)' }} onClick={crearInventario}><TbPlus size={23} /></Button>
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Crear Producto</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={cerrarModalInventario} />
                </div>}
                visible={modalInventario}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModalInventario}
                closable={false}
            >
                <form onSubmit={CrearProduto}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            <GetUltimoSku pasarSetDataInventario={handleSKUChange}/>
                            <FloatLabel>
                                <InputText id="nombre" name="nombre" style={{ width: '100%' }} value={dataProducto.nombre} onChange={handleInputChange} />
                                <label htmlFor="nombre" style={{ textAlign: "center", }}>Nombre del Producto</label>
                            </FloatLabel>
                            <GetFamiliasOrden pasarSetDataProducto={handleSubFamiliaChange} />
                            <GetUnidadMedidaOrden pasarSetDataProducto={handleUnidadDeMedidaChange} />
                        </div>
                    </div>
                </form>
            </Dialog >
            {/* Mostrar el spinner si está cargando */}
            {
                cargando && (
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
                )
            }
        </>
    );
};