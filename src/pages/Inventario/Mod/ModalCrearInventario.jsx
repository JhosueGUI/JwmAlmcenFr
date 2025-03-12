import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from 'primereact/floatlabel';
import GetUnidadMedida from "../Services/GetUnidadMedida";
import GetUbicacion from "../Services/GetUbicacion";
import { DataInventario } from "../Data/DataInventario";

// Importar ReactPrime Confirmar Dialogo
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import GetFamilias from "../Services/GetFamilias";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { GetUltimoSku } from "../Services/GetUltimoSku";
import UsarCrearInventario from "../Hooks/UsarCrearInventario";
import { GetInventario } from "../Services/InventarioApi";

const ModalCrearInventario = ({ pasarSetInventario }) => {
    //hooks
    const { Crear } = UsarCrearInventario();
    //traer al token
    const { obtenerToken } = useContext(AuthContext)
    //#region Estado para modal
    const [modal, setModal] = useState(false);
    const abrirModalCrear = () => {
        setModal(true);
    };
    const cerrarModalCrear = () => {
        setModal(false);
    };

    //#region Estado para obtener la data inicial
    const [dataInventario, setDataInventario] = useState(DataInventario)

    const agregarInventario = async () => {
        try {
            const token = obtenerToken();
            await Crear(dataInventario);
            const respuesta = await GetInventario(token);
            const InventarioAdaptado = respuesta.map(item => ({
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

                // fecha_salida: item.inventario.producto.transacciones[1]?.salida[0]?.fecha || '',
                // fecha_ingreso: item.inventario.producto.transacciones[0]?.ingreso[0]?.fecha || '',

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
            pasarSetInventario(InventarioAdaptado);
            cerrarModalCrear();

        } catch (error) {
            console.error("Error al agregar una categoría:", error);
            toast.current.show({ severity: 'info', summary: 'Observación', detail: error.response?.data?.resp || 'Error al Crear el Inventario', life: 3000 });
        }
    };
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
    // Maneja cambio solo para el sku nuevo
    const handleSKUChange = (nuevoSKU) => {
        setDataInventario({
            ...dataInventario,
            SKU: nuevoSKU
        });
    };



    //#region Estado Para Confirmacion
    const toast = useRef(null);
    const reject = () => {
        toast.current.show({ severity: 'error', summary: 'Cancelado', detail: 'Creación de Inventario cancelado', life: 3000 });
    };

    const confirmarCreacion = () => {
        confirmDialog({
            message: '¿Está seguro de crear Inventario Valorizado?',
            header: 'Confirmar Creación',
            icon: 'pi pi-exclamation-triangle',
            accept: agregarInventario,
            reject
        });
    };


    const footer = (
        <div>
            <Button label="Guardar" onClick={confirmarCreacion} className="p-button-success" />
            <Button label="Cancelar" onClick={cerrarModalCrear} className="p-button-secondary" />
        </div>
    );

    return (
        <>
            {/* Confirmacion */}
            <Toast ref={toast} />
            <ConfirmDialog />
            {/* Contenido */}

            <Button icon="pi pi-plus" label="Agregar Inventario" severity="info" outlined onClick={abrirModalCrear} style={{ color: '#1A55B0' }} />
            <Dialog
                header={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px' }}>
                    <h3>Crear Inventario</h3>
                    <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" onClick={cerrarModalCrear} />
                </div>}
                visible={modal}
                style={{ width: '30%', minWidth: '300px' }}
                footer={footer}
                onHide={cerrarModalCrear}
                closable={false}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {/* formulario */}
                        <form onSubmit={agregarInventario}>
                            <div style={{ marginTop: "20px", width: "100%", display: 'flex', flexDirection: 'column', gap: '25px' }}>

                                <GetUbicacion pasarSetDataInventario={handleUbicacionChange} />

                                <GetUltimoSku pasarSetDataInventario={handleSKUChange} />

                                <GetFamilias pasarSetDataInventario={handleSubFamiliaChange} />

                                <FloatLabel>
                                    <InputText id="articulo" name="nombre" style={{ width: '100%' }} value={dataInventario.nombre} onChange={handleInputChange} />
                                    <label htmlFor="articulo" style={{ textAlign: "center" }}>Articulo</label>
                                </FloatLabel>

                                <GetUnidadMedida pasarSetDataInventario={handleUnidadDeMedidaChange} />

                            </div>
                        </form>

                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default ModalCrearInventario;
