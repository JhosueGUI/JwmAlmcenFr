//Input con Slider
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
//import axios
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
const ModalEliminarInventario = ({ pasarAbrirModalEliminar, pasarCerrarModalEliminar, pasarSetInventario, pasarInventarioSeleccionado }) => {
    //obtener el token
    const {obtenerToken}=useContext(AuthContext)
    //#region Estados para plasmar en los inputs
    const [NombreCodigoEliminar, setCodigoNombreEliminar] = useState('')
    const [NombreEliminar, setNombreEliminar] = useState('')
    useEffect(() => {
        if (pasarInventarioSeleccionado) {
            const CodigoNombre = pasarInventarioSeleccionado.SKU
            setCodigoNombreEliminar(CodigoNombre)
            const EliminarNombre = pasarInventarioSeleccionado.nombre
            setNombreEliminar(EliminarNombre)
        }
    }, [pasarInventarioSeleccionado])
    //#region Estados Para Eliminar Inventario
    const EliminarInventario = async () => {
        try {
            const token = obtenerToken();
            if (token && pasarInventarioSeleccionado) {
                const respuestaPost = await axios.delete(`http://127.0.0.1:8000/api/almacen/inventario_valorizado/delete/${pasarInventarioSeleccionado.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const respuestaGet = await axios.get("http://127.0.0.1:8000/api/almacen/inventario_valorizado/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                //para que se visualice en la tabla debe mandarse mediante esto segun la estructura
                pasarSetInventario(respuestaGet.data.data.map(item => ({
                    id: item.id || '',
                    ubicacion: item.inventario.ubicacion?.codigo_ubicacion || '',
                    SKU: item.inventario.producto?.SKU || '',
                    familia: item.inventario?.producto?.articulo?.sub_familia?.familia?.familia ?? null,
                    sub_familia: item.inventario.producto.articulo.sub_familia?.nombre || '',
                    nombre: item.inventario.producto.articulo?.nombre || '',
                    unidad_medida: item.inventario.producto.unidad_medida?.nombre || '',
                    fecha_salida: item.inventario.producto.transacciones[1]?.salida[0]?.fecha || '',
                    fecha_ingreso: item.inventario.producto.transacciones[0]?.ingreso[0]?.fecha || '',
                    precio_dolares: item.transaccion?.precio_dolares || '',
                    precio_soles: item.transaccion?.precio_soles || '',
                    valor_inventario: item.inventario?.valor_inventario || '',
                    total_ingreso: item.inventario?.total_ingreso || '',
                    total_salida: item.inventario?.total_ingreso || '',
                    stock_logico: item.inventario?.stock_logico || '',
                    demanda_mensual: item.inventario?.demanda_mensual || '',
                    estado_operativo: item.inventario.estado_operativo?.nombre || '',
                })));
                const mensajeDelServidor = respuestaPost.data.resp
                // Mostrar un mensaje de éxito con React Prime
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                // Cerrar el modal después de agregar la categoría
                pasarCerrarModalEliminar();
            } else {
                toast.current.show({ severity: 'info', summary: 'Observación', detail: 'No se capturo ningun Inventario', life: 3000 });
            }
        } catch (error) {
            console.error("Error al eliminar :", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Error al Eliminar Inventario: ${error.message}`, life: 3000 });
        }
    };
    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Eliminación de personal cancelada', life: 3000 });
    };

    const confirmarEliminar = () => {
        confirmDialog({
            message: '¿Está seguro de eliminar este Inventario?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            accept: EliminarInventario,
            reject
        });
    };
    const footer = (
        <div>
            <Button label="Eliminar" onClick={confirmarEliminar} className="p-button-danger" />
            <Button label="Cancelar" onClick={pasarCerrarModalEliminar} className="p-button-secondary" />
        </div>
    );
    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Eliminar Inventario</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalEliminar} />
                </div>}
                visible={pasarAbrirModalEliminar}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalEliminar}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <FloatLabel>
                            <InputText id="nombre" style={{ width: '100%' }} value={NombreCodigoEliminar} disabled />
                            <label htmlFor="nombre" style={{ textAlign: "center", }}>Codigo</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText id="nombre" style={{ width: '100%' }} value={NombreEliminar} disabled />
                            <label htmlFor="nombre" style={{ textAlign: "center", }}>Nombre</label>
                        </FloatLabel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ModalEliminarInventario;