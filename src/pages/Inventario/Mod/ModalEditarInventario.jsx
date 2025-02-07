import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from 'primereact/floatlabel';
import axios from "axios";
import GetUnidadMedida from "../Services/GetUnidadMedida";
//Input Para MASCARAS
import { InputMask } from 'primereact/inputmask';
///inputNumero
import { InputNumber } from 'primereact/inputnumber';
import GetEstadoOperativo from "../Services/GetEstadoOperativo";
import GetUbicacion from "../Services/GetUbicacion";
import { DataInventario } from "../Data/DataInventario";

// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import GetFamilias from "../Services/GetFamilias";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export const ModalEditarInventario = ({ pasarCerrarModalEditar,pasarAbrirModalEditar,pasarSetInventario,pasarInventarioSeleccionado}) => {
    //traer al token
    const {obtenerToken}=useContext(AuthContext)

    //#region Estado para obtener la data inicial
    const [dataInventario, setDataInventario] = useState(DataInventario)
    const editarInventario = async () => {
        try {
            const token = obtenerToken();
            if (token) {
                const respuestaPostInventario = await axios.post(`http://127.0.0.1:8000/api/almacen/inventario_valorizado/update/${pasarInventarioSeleccionado.id}`, dataInventario, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Obtener las categorías actualizadas después de agregar una nueva categoría
                const respuestaGetInventario = await axios.get("http://127.0.0.1:8000/api/almacen/inventario_valorizado/get", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const InventarioTransformado = respuestaGetInventario.data.data.map(item => ({
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
                }));
                // Actualizar el estado de las categorías con los datos obtenidos
                pasarSetInventario(InventarioTransformado);
                // Restaurar los datos de categoría a su estado inicial
                setDataInventario(dataInventario);
                const mensajeDelServidor = respuestaPostInventario.data.resp
                // Mostrar un mensaje de éxito
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensajeDelServidor, life: 3000 });
                // Cerrar el modal después de agregar la categoría
                pasarCerrarModalEditar();
            }
        } catch (error) {
            console.error("Error al agregar una categoría:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Editar el Inventario', life: 3000 });
        }
    };
    //#region Plasmar los datos del Personal a los Inputs
    useEffect(() => {
        if (pasarInventarioSeleccionado) {
            console.log(pasarInventarioSeleccionado)
            setDataInventario({
                unidad_medida_id:pasarInventarioSeleccionado.unidad_medida_id,
                sub_familia_id:pasarInventarioSeleccionado.sub_familia_id,
                ubicacion_id:pasarInventarioSeleccionado.ubicacion_id,
                SKU: pasarInventarioSeleccionado.SKU,
                nombre: pasarInventarioSeleccionado.nombre
                
            });
        }
    }, [pasarInventarioSeleccionado])
    // Manejar cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDataInventario({
            ...dataInventario,
            [name]: value.toUpperCase()
        });
    };
    // Manejar cambios en los campos del formulario para solo ubicacion
    const handleUbicacionChange = (ubicacionSeleccionada) => {
        setDataInventario({
            ...dataInventario,
            ubicacion_id: ubicacionSeleccionada.id
        });
    };
    // Manejar cambios en los campos del formulario para solo sub familia
    const handleSubFamiliaChange = (subFamiliaSeleccionada) => {
        setDataInventario({
            ...dataInventario,
            sub_familia_id: subFamiliaSeleccionada.id
        });
    };
    // Manejar cambios en los campos del formulario para solo UNIDAD DE MEDIDAD
    const handleUnidadDeMedidaChange = (unidadMedidaSeleccionada) => {
        setDataInventario({
            ...dataInventario,
            unidad_medida_id: unidadMedidaSeleccionada.id
        });
    };


    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Creación de Inventario cancelado', life: 3000 });
    };

    const confirmarEdicion = () => {
        confirmDialog({
            message: '¿Está seguro de ediitar Inventario Valorizado?',
            header: 'Confirmar Edicion',
            icon: 'pi pi-exclamation-triangle',
            accept: editarInventario,
            reject
        });
    };


    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarEdicion} className="p-button-success" />
            <Button label="Cancelar" onClick={pasarCerrarModalEditar} className="p-button-secondary" />
        </div>
    );

    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            {/* Contenido */}            
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Editar Inventario</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={pasarCerrarModalEditar} />
                </div>}
                visible={pasarAbrirModalEditar}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={pasarCerrarModalEditar}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {/* formulario */}
                        <form onSubmit={editarInventario}>
                            <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>

                                <GetUbicacion pasarSetDataInventario={handleUbicacionChange} pasarUbicacionSeleccionado={pasarInventarioSeleccionado}/>

                                <FloatLabel>
                                    <InputNumber id="SKU" name="SKU" style={{ width: '100%' }} value={dataInventario.SKU || null} onChange={(e) => setDataInventario({ ...dataInventario, SKU: e.value })} disabled/>
                                    <label htmlFor="SKU" style={{ textAlign: "center" }}>SKU</label>
                                </FloatLabel>

                                <GetFamilias pasarSetDataInventario={handleSubFamiliaChange} pasarFamiliaSeleccionado={pasarInventarioSeleccionado}/>

                                <FloatLabel>
                                    <InputText id="articulo" name="nombre" style={{ width: '100%' }} value={dataInventario.nombre} onChange={handleInputChange} />
                                    <label htmlFor="articulo" style={{ textAlign: "center" }}>Articulo</label>
                                </FloatLabel>

                                <GetUnidadMedida pasarSetDataInventario={handleUnidadDeMedidaChange} pasarUnidadMedidaSeleccionado={pasarInventarioSeleccionado}/>

                            </div>
                        </form>

                    </div>
                </div>
            </Dialog>
        </>
    );
};

